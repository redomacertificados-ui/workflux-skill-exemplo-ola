#!/usr/bin/env node
// Pacote canonico de uma Skill da Workflux Factory e o seu sha256 (WF-0029 §3.16).
//
// Uso:   node scripts/package-hash.mjs [diretorio-da-skill] [--out pacote.tar.gz]
// Saida: o sha256 do pacote canonico, que e o hash que a Factory registra para a versao.
//
// Sem dependencias (so Node >= 20). Reproduz byte a byte o pacote da Factory:
// - entradas: workflux-skill.json + os caminhos de "files", em ordem pelos bytes UTF-8;
// - tar ustar: so arquivos regulares, modo 0644 (0755 so para "executables"),
//   uid/gid 0, mtime 0, uname/gname vazios, dois blocos zerados no fim;
// - gzip: zlib nivel 9, mtime 0, sem nome, byte de SO = 3.
// Faz tambem as conferencias locais que nao dependem da Factory (arquivos existem,
// sao regulares, caminhos validos, limites). A validacao completa e a da Factory.
import { createHash } from "node:crypto";
import { lstatSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const args = process.argv.slice(2);
const outIndex = args.indexOf("--out");
const out = outIndex >= 0 ? args[outIndex + 1] : null;
const dir = args.find((a, i) => !a.startsWith("--") && (outIndex < 0 || i !== outIndex + 1)) ?? ".";

const LIMITS = { packageMaxBytes: 2 * 1024 * 1024, filesMax: 200, entrypointMaxBytes: 64 * 1024, pathMaxBytes: 255 };
const errors = [];
const fail = (m) => errors.push(m);

function pathProblem(p) {
  if (typeof p !== "string" || p.length === 0) return "caminho vazio";
  if (p.normalize("NFC") !== p) return "Unicode nao normalizado (NFC)";
  const bytes = Buffer.from(p, "utf8");
  if (bytes.length > LIMITS.pathMaxBytes) return "caminho longo demais";
  if (p.startsWith("/") || p.includes("\\") || /[\u0000-\u001f\u007f]/.test(p)) return "caminho invalido";
  const parts = p.split("/");
  if (parts.some((x) => x === "" || x === "." || x === "..")) return "componente invalido";
  if (bytes.length > 100) {
    let fits = false;
    for (let i = bytes.length - 1; i > 0; i--) if (bytes[i] === 0x2f && i <= 155 && bytes.length - i - 1 <= 100) fits = true;
    if (!fits) return "nao cabe no ustar (nome final <= 100 bytes, prefixo <= 155)";
  }
  return null;
}

const manifestBytes = readFileSync(join(dir, "workflux-skill.json"));
const manifest = JSON.parse(manifestBytes.toString("utf8"));
const files = Array.isArray(manifest.files) ? manifest.files : [];
const executables = new Set(manifest.executables ?? []);
if (files.length === 0) fail('"files" vazio');
if (files.length > LIMITS.filesMax) fail(`mais de ${LIMITS.filesMax} arquivos`);
if (new Set(files).size !== files.length) fail("caminho repetido em files");
if (!files.includes(manifest.entrypoint)) fail("entrypoint fora de files");
if (manifest.changelog !== undefined && !files.includes(manifest.changelog)) fail("changelog fora de files");
for (const e of executables) if (!files.includes(e)) fail(`executable fora de files: ${e}`);
const lower = new Map();
for (const f of files) {
  const k = f.toLowerCase();
  if (lower.has(k) && lower.get(k) !== f) fail(`colisao de caixa: ${lower.get(k)} / ${f}`);
  lower.set(k, f);
}

const entries = [{ path: "workflux-skill.json", content: manifestBytes, executable: false }];
let total = manifestBytes.length;
for (const f of files) {
  const problem = pathProblem(f);
  if (problem) {
    fail(`${f}: ${problem}`);
    continue;
  }
  let st;
  try {
    st = lstatSync(join(dir, f));
  } catch {
    fail(`${f}: ausente`);
    continue;
  }
  if (st.isSymbolicLink()) fail(`${f}: link simbolico`);
  else if (!st.isFile()) fail(`${f}: nao e arquivo regular`);
  else {
    const content = readFileSync(join(dir, f));
    total += content.length;
    if (f === manifest.entrypoint && content.length > LIMITS.entrypointMaxBytes) fail("entrypoint acima de 64 KiB");
    entries.push({ path: f, content, executable: executables.has(f) });
  }
}
if (total > LIMITS.packageMaxBytes) fail("pacote acima de 2 MiB");
if (errors.length > 0) {
  for (const e of errors) console.error(`ERRO: ${e}`);
  process.exit(1);
}

const octal = (v, w) => v.toString(8).padStart(w - 1, "0") + "\0";
function header(e) {
  const h = Buffer.alloc(512, 0);
  const full = Buffer.from(e.path, "utf8");
  let name = full;
  let prefix = Buffer.alloc(0);
  if (full.length > 100) {
    for (let i = full.length - 1; i > 0; i--) {
      if (full[i] === 0x2f && i <= 155 && full.length - i - 1 <= 100) {
        prefix = full.subarray(0, i);
        name = full.subarray(i + 1);
        break;
      }
    }
  }
  name.copy(h, 0);
  h.write(octal(e.executable ? 0o755 : 0o644, 8), 100, "ascii");
  h.write(octal(0, 8), 108, "ascii");
  h.write(octal(0, 8), 116, "ascii");
  h.write(octal(e.content.length, 12), 124, "ascii");
  h.write(octal(0, 12), 136, "ascii");
  h.write("        ", 148, "ascii");
  h.write("0", 156, "ascii");
  h.write("ustar\0", 257, "ascii");
  h.write("00", 263, "ascii");
  prefix.copy(h, 345);
  let sum = 0;
  for (const b of h) sum += b;
  h.write(octal(sum, 7) + " ", 148, "ascii");
  return h;
}
entries.sort((a, b) => Buffer.compare(Buffer.from(a.path, "utf8"), Buffer.from(b.path, "utf8")));
const parts = [];
for (const e of entries) {
  parts.push(header(e), e.content);
  const pad = (512 - (e.content.length % 512)) % 512;
  if (pad) parts.push(Buffer.alloc(pad, 0));
}
parts.push(Buffer.alloc(1024, 0));
const gz = gzipSync(Buffer.concat(parts), { level: 9, memLevel: 8, windowBits: 15 });
gz.writeUInt32LE(0, 4);
gz[9] = 3;
if (out) writeFileSync(out, gz);
console.log(createHash("sha256").update(gz).digest("hex"));

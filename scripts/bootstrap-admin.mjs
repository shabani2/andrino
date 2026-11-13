import { createInterface, emitKeypressEvents } from "node:readline";
import { createClient } from "@supabase/supabase-js";

const projectRef = "qvuexmazymzziewbxmow";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const resetExisting = args.includes("--reset-existing");

if (args.some((arg) => !["--check", "--reset-existing"].includes(arg)) || (checkOnly && resetExisting)) {
  console.error("Option inconnue. Utilisez --check ou --reset-existing.");
  process.exit(1);
}
if (!url || !secret) {
  console.error("Configuration Supabase absente. Renseignez .env.local.");
  process.exit(1);
}
if (!URL.canParse(url) || new URL(url).hostname !== `${projectRef}.supabase.co`) {
  console.error("Projet Supabase inattendu. Vérifiez NEXT_PUBLIC_SUPABASE_URL.");
  process.exit(1);
}

const client = createClient(url, secret, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function verifyAccess() {
  const auth = await client.auth.admin.listUsers({ page: 1, perPage: 1 });
  if (auth.error) throw new Error(`Accès Auth refusé. Vérifiez SUPABASE_SECRET_KEY. (${auth.error.message})`);

  const staff = await client.from("staff_members")
    .select("user_id,display_name,avatar_path,phone").limit(1);
  if (staff.error) throw new Error(`Profil indisponible. Appliquez la migration. (${staff.error.message})`);
}

async function findUser(email) {
  for (let page = 1; ; page += 1) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(`Lecture des comptes impossible. Vérifiez la clé secrète. (${error.message})`);
    const user = data.users.find((item) => item.email?.toLowerCase() === email.toLowerCase());
    if (user) return user;
    if (data.users.length < 1000) return null;
  }
}

function askEmail() {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question("E-mail admin : ", (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function askPassword(label) {
  return new Promise((resolve, reject) => {
    let value = "";
    process.stdout.write(label);
    emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();

    function finish(error) {
      process.stdin.off("keypress", onKeypress);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write("\n");
      if (error) reject(error);
      else resolve(value);
    }

    function onKeypress(character, key) {
      if (key?.ctrl && key.name === "c") return finish(new Error("Opération annulée."));
      if (key?.name === "return" || key?.name === "enter") return finish();
      if (key?.name === "backspace") {
        if (value) {
          value = value.slice(0, -1);
          process.stdout.write("\b \b");
        }
        return;
      }
      if (character && !key?.ctrl && !key?.meta && !key?.sequence?.startsWith("\u001b")) {
        value += character;
        process.stdout.write("*");
      }
    }

    process.stdin.on("keypress", onKeypress);
  });
}

async function grantAdmin(userId) {
  const current = await client.from("staff_members")
    .select("user_id").eq("user_id", userId).maybeSingle();
  if (current.error) throw current.error;

  const result = current.data
    ? await client.from("staff_members").update({ role: "admin", active: true }).eq("user_id", userId)
    : await client.from("staff_members").insert({ user_id: userId, role: "admin", active: true });
  if (result.error) {
    throw new Error(`Compte Auth créé ou modifié, mais rôle admin absent. Relancez avec --reset-existing. (${result.error.message})`);
  }
}

try {
  await verifyAccess();
  if (checkOnly) {
    console.log("Bootstrap prêt pour Andrino_Blog. Auth et profil accessibles.");
  } else {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
      throw new Error("Terminal interactif requis. Lancez la commande dans PowerShell.");
    }

    const email = await askEmail();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Adresse e-mail invalide. Relancez avec une adresse complète.");
    }

    const existing = await findUser(email);
    if (existing && !resetExisting) {
      throw new Error("Compte déjà présent. Utilisez --reset-existing pour modifier son mot de passe et son rôle.");
    }
    if (!existing && resetExisting) {
      throw new Error("Compte introuvable. Relancez sans --reset-existing pour le créer.");
    }

    const password = await askPassword("Mot de passe (12 caractères minimum) : ");
    const confirmation = await askPassword("Confirmer le mot de passe : ");
    if (password.length < 12) throw new Error("Mot de passe trop court. Utilisez au moins 12 caractères.");
    if (password !== confirmation) throw new Error("Mots de passe différents. Relancez la commande.");

    let userId;
    if (existing) {
      const { error } = await client.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
      });
      if (error) throw new Error(`Mot de passe non modifié. Vérifiez les règles Auth. (${error.message})`);
      userId = existing.id;
    } else {
      const { data, error } = await client.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (error || !data.user) {
        throw new Error(`Compte non créé. Vérifiez l'adresse et les règles Auth. (${error?.message ?? "réponse vide"})`);
      }
      userId = data.user.id;
    }

    await grantAdmin(userId);
    console.log(existing ? "Mot de passe et accès admin mis à jour." : "Compte admin créé.");
    console.log("Nom, photo et téléphone pourront être renseignés plus tard.");
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

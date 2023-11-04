import { TiktokDL } from "@tobyg74/tiktok-api-dl";

export default {
  name: "tiktok",
  alias: ["tt"],

  run: async (socket, msg, args) => {
    try {
      const url = args.join(" ");

      if (!url) {
        socket.sendMessage(msg.messages[0]?.key.remoteJid, {
          text: "Ingrese la URl del vídeo de TikTok que deseas descargar.",
        });

        return;
      }

      const regexp =
        /^(https?:\/\/)?(www\.|vm\.)?tiktok\.com\/[@a-zA-Z0-9_.~=\/-?]+/i;

      if (!regexp.test(url)) {
        socket.sendMessage(msg.messages[0]?.key.remoteJid, {
          text: "URL inválida.",
        });

        return;
      }

      socket.sendMessage(msg.messages[0]?.key.remoteJid, {
        react: { text: "⏳", key: msg.messages[0]?.key },
      });

      const { status, result } = await TiktokDL(url, { version: "v2" });

      if (status !== "success") {
        socket.sendMessage(msg.messages[0]?.key.remoteJid, {
          text: "Ha ocurrido un error, vuelve a intentarlo.",
        });

        return;
      }

      await new Promise(async (resolve, reject) => {
        if (result.type === "image") {
          result.images.map((img) => {
            socket.sendMessage(msg.messages[0]?.key.remoteJid, {
              image: { url: img },
            });
          });

          resolve(true);
        } else if (result.type === "video") {
          await socket.sendMessage(msg.messages[0]?.key.remoteJid, {
            video: { url: result.video },
          });

          resolve(true);
        }
      });

      socket.sendMessage(msg.messages[0]?.key.remoteJid, {
        react: { text: "✅", key: msg.messages[0]?.key },
      });
    } catch (error) {
      console.log(error);

      socket.sendMessage(msg.messages[0]?.key.remoteJid, {
        text: "Sucedió un error inesperado.",
      });
    }
  },
};
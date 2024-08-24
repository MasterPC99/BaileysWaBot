import os from 'os';

const botStartTime = Date.now();

export default {
  name: "ping",
  alias: ["pg"],
  description:"obtén el ping del bot",

  run: (socket, msg, args) => {
    const startTime = Date.now();

    socket.sendMessage(msg.messages[0]?.key?.remoteJid, {
      text: "🏓 Calculando latencia...",
    }).then(() => {
      const endTime = Date.now();
      const latency = endTime - startTime;

      const cpuUsage = getCPUUsage();
      const ramUsage = getRAMUsage();

      const additionalInfo = `
        🚀 Versión: 1.0
        🌐 Servidor: OptikServer
        🤖 Desarrollador: Master_PC99
        💻 CPU: ${os.cpus()[0].model}
        🧠 RAM Total: ${Math.round(os.totalmem() / (1024 * 1024))} MB
        🧠 RAM Libre: ${Math.round(os.freemem() / (1024 * 1024))} MB
        🔄 Load Average: ${os.loadavg().join(' ')}
        🖥️ Uso de CPU: ${cpuUsage}%
        🧠 Uso de RAM: ${ramUsage}%
        ⏰ Tiempo encendido: ${formatUptime()}
      `;

      const message = `La latencia del bot es de ${latency}ms.🏓\n\n${additionalInfo}`;

      socket.sendMessage(msg.messages[0]?.key?.remoteJid, {
        text: message,
        react: { text: "🏓", key: msg.messages[0]?.key },
      });
    });

    function formatUptime() {
      const uptime = Date.now() - botStartTime;
      const seconds = Math.floor(uptime / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    }

    function getCPUUsage() {
      const cpuInfo = os.cpus();
const usage = cpuInfo.reduce((acc, cpu) => acc + cpu.times.user + cpu.times.nice + cpu.times.sys, 0);
      const total = cpuInfo.reduce((acc, cpu) => acc + cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle, 0);

      return Math.round((usage / total) * 100);
    }

    function getRAMUsage() {
      const total = os.totalmem();
      const free = os.freemem();
      const used = total - free;
      return Math.round((used / total) * 100);
    }
  },
}

import { networkInterfaces } from 'os'

/**
 * get local ip addr
 */
export default function getIPAddress() {
  const interfaces = networkInterfaces()
  for (const dev in interfaces) {
    const ips = interfaces[dev] || []
    for (let i = 0; i < ips.length; i++) {
      const ip = ips[i]
      if (ip.family === 'IPv4' && ip.address !== '127.0.0.1' && !ip.internal) {
        return ip.address
      }
    }
  }
  return ''
}

export default function handler(req, res) {
  res.status(200).json({
    status: 'online',
    platform: 'LIMO — Engineering Project Hub',
    timestamp: new Date().toISOString()
  });
}

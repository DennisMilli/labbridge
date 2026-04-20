import { useEffect, useRef } from "react"

function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let W = 0, H = 0
    let animId: number

    class Particle {
      x = 0; y = 0; r = 0; vx = 0; vy = 0; alpha = 0; color = ""
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * W
        this.y = Math.random() * H
        this.r = Math.random() * 1.2 + 0.2
        this.vx = (Math.random() - 0.5) * 0.3
        this.vy = (Math.random() - 0.5) * 0.3
        this.alpha = Math.random() * 0.4 + 0.05
        this.color = Math.random() > 0.7 ? "#8b5cf6" : "#00f5d4"
      }
      update() {
        this.x += this.vx; this.y += this.vy
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset()
      }
      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.alpha
        ctx.fill()
      }
    }

    const particles: Particle[] = []

    function resize() {
      if (!canvas) return
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    function init() {
      resize()
      particles.length = 0
      for (let i = 0; i < 120; i++) particles.push(new Particle())
    }

    function loop() {
      if (!ctx) return
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => { p.update(); p.draw() })
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(loop)
    }

    init()
    loop()
    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <>
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,245,212,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,212,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Noise texture */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Cyan orb — top left */}
      <div
        className="fixed pointer-events-none z-0 rounded-full"
        style={{
          width: 420, height: 420,
          top: "-10%", left: "-8%",
          background: "rgba(0,245,212,0.07)",
          filter: "blur(90px)",
          animation: "drift 12s ease-in-out infinite",
        }}
      />

      {/* Violet orb — bottom right */}
      <div
        className="fixed pointer-events-none z-0 rounded-full"
        style={{
          width: 500, height: 500,
          bottom: "-15%", right: "-10%",
          background: "rgba(139,92,246,0.06)",
          filter: "blur(90px)",
          animation: "drift 12s ease-in-out infinite",
          animationDelay: "-4s",
        }}
      />

      {/* Purple orb — center right */}
      <div
        className="fixed pointer-events-none z-0 rounded-full"
        style={{
          width: 300, height: 300,
          top: "40%", left: "55%",
          background: "rgba(100,60,255,0.08)",
          filter: "blur(90px)",
          animation: "drift 12s ease-in-out infinite",
          animationDelay: "-8s",
        }}
      />
    </>
  )
}

export default Background

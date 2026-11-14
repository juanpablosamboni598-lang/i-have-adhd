# Revisión del reporte FASE 0 — correcciones verificadas

Veredicto: el plan es válido. Se mantiene vectorbt (FASE 3), demo de OKX (FASE 4) y `--read-only` obligatorio. Abajo, lo que hay que corregir.

## ❌ Error: Freqtrade + OKX (estaba al revés)
- Freqtrade en futuros **solo soporta `isolated`**; `cross` está "currently unavailable" (única excepción: Binance BNFCR).
- Si algún día se usa Freqtrade:
  ```json
  "trading_mode": "futures",
  "margin_mode": "isolated"
  ```

## ⚠️ Puntos exagerados
- **"Histórico limitado a ~1000 velas"**: falso como límite. OKX tiene endpoint de histórico paginado; con CCXT se bajan años de datos (lento, pero posible). Hacer descarga incremental y guardar en CSV/DB.
- **"Un bug puede mandar la orden demo a la cuenta real"**: solo si se cargan claves live. Las claves demo no funcionan en producción. Regla: claves demo y live separadas, nunca ambas en el mismo perfil del bot.
- **"~70 indicadores integrados"**: no verificado. Comprobar al instalar (listar herramientas del módulo market).

## ✅ Confirmado
- Kit oficial: `okx/agent-trade-kit` (paquetes `okx-trade-mcp` y `okx-trade-cli`, MIT).
- Sin flags arranca con spot, swap y account (puede operar) → usar siempre `--read-only`.
- `--modules market` = solo datos de mercado, sin API key.
- Requisito: Node.js >= 18.
- vectorbt: no modela funding; corregir fills (open de la vela siguiente, `shift(1)`) y usar contratos enteros.
- Demo OKX: header `x-simulated-trading: 1`, mismo host.

## 🔒 Seguridad al instalar
Existen copias del repo (PlaceNL2026, dex-original) y paquetes con nombres parecidos (`agent-tradekit-mcp`). Instalar **solo** desde la org oficial:
```bash
npm install -g @okx_ai/okx-trade-mcp @okx_ai/okx-trade-cli
okx-trade-mcp --modules market --read-only
```

## ➕ Faltaba en el reporte
1. Validación fuera de muestra / walk-forward para evitar sobreajuste.
2. Fees de taker + slippage dentro del backtest.
3. Funding con signo: según la dirección, puede ser costo o ingreso.
4. Fijar umbrales antes de ver resultados (ej. PF > 1,3, max DD < 20 %, expectancy > 0 neta, N de trades suficiente).

## Fuentes
- https://github.com/okx/agent-trade-kit
- https://codeclimate.com/github/freqtrade/freqtrade/docs/leverage.md/source

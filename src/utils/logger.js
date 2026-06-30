/**
 * Production-ready logging utility with environment-aware levels
 */

const LOG_LEVELS = {
  development: 0,
  staging: 1,
  production: 2,
};

const LOG_LEVEL = LOG_LEVELS[import.meta.env.MODE] || LOG_LEVELS.production;

class Logger {
  log(message, data = null) {
    if (LOG_LEVEL <= 0) {
      console.log(`[LOG] ${message}`, data || "");
    }
  }

  debug(message, data = null) {
    if (LOG_LEVEL <= 0) {
      console.debug(`[DEBUG] ${message}`, data || "");
    }
  }

  info(message, data = null) {
    if (LOG_LEVEL <= 0) {
      console.info(`[INFO] ${message}`, data || "");
    }
  }

  warn(message, data = null) {
    if (LOG_LEVEL <= 1) {
      console.warn(`[WARN] ${message}`, data || "");
      this.reportToService("warning", message, data);
    }
  }

  error(message, error = null) {
    console.error(`[ERROR] ${message}`, error || "");
    this.reportToService("error", message, error);
  }

  /**
   * Report errors/warnings to external service
   * Could be Sentry, LogRocket, or custom logging service
   */
  reportToService(_level, _message, _data) {
    if (
      import.meta.env.MODE === "production" &&
      import.meta.env.VITE_SENTRY_DSN
    ) {
      // Example: Sentry integration
      // Sentry.captureMessage(message, level, { extra: data });
      // Example: Custom logging endpoint
      // fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ level, message, data, timestamp: new Date().toISOString() })
      // }).catch(() => {}); // Silently fail to avoid disrupting the app
    }
  }

  /**
   * Structured logging for analytics
   */
  analytics(event, properties = {}) {
    if (import.meta.env.VITE_ENABLE_ANALYTICS === "true") {
      // Example: Google Analytics integration
      // if (window.gtag) {
      //   window.gtag('event', event, properties);
      // }

      console.log(`[ANALYTICS] ${event}`, properties);
    }
  }
}

export default new Logger();

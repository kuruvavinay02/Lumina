import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        map: 'Safety Map',
        report: 'Report',
        about: 'About',
        login: 'Login',
        dashboard: 'Dashboard'
      },
      hero: {
        title: 'Safety Intelligence for Everyone',
        subtitle: 'Navigate your city with confidence. Real-time safety insights powered by community intelligence.',
        cta: 'Explore Safety Map',
        secondaryCta: 'Learn More'
      },
      features: {
        map: {
          title: 'Interactive Safety Map',
          description: 'View real-time risk zones with color-coded streets and time-of-day intelligence.'
        },
        routes: {
          title: 'Safe Route Planning',
          description: 'Find the safest path to your destination with risk-aware navigation.'
        },
        community: {
          title: 'Community Intelligence',
          description: 'Anonymous safety reporting with confidence-weighted validation.'
        },
        insights: {
          title: 'NGO & Policy Insights',
          description: 'Data-driven dashboards for intervention planning and impact tracking.'
        }
      },
      map: {
        searchPlaceholder: 'Search location...',
        timeOfDay: 'Time of Day',
        morning: 'Morning',
        evening: 'Evening',
        night: 'Night',
        safetyScore: 'Safety Score',
        reportIncident: 'Report Incident',
        planRoute: 'Plan Route',
        filters: 'Filters'
      },
      report: {
        title: 'Report Safety Signal',
        subtitle: 'Your anonymous report helps keep the community safe',
        incidentType: 'Incident Type',
        severity: 'Severity',
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        description: 'Description (Optional)',
        submit: 'Submit Report',
        success: 'Thank you! Your report has been recorded.'
      },
      dashboard: {
        overview: 'Overview',
        metrics: 'Key Metrics',
        trends: 'Risk Trends',
        hotspots: 'Emerging Hotspots',
        export: 'Export Data'
      },
      footer: {
        privacy: 'Privacy',
        ethics: 'Ethics',
        contact: 'Contact',
        openSource: 'Open Source'
      }
    }
  },
  es: {
    translation: {
      nav: {
        home: 'Inicio',
        map: 'Mapa de Seguridad',
        report: 'Reportar',
        about: 'Acerca de',
        login: 'Iniciar Sesión',
        dashboard: 'Panel'
      },
      hero: {
        title: 'Inteligencia de Seguridad para Todos',
        subtitle: 'Navega tu ciudad con confianza. Información de seguridad en tiempo real impulsada por la inteligencia comunitaria.',
        cta: 'Explorar Mapa',
        secondaryCta: 'Saber Más'
      },
      features: {
        map: {
          title: 'Mapa de Seguridad Interactivo',
          description: 'Ver zonas de riesgo en tiempo real con calles codificadas por colores.'
        },
        routes: {
          title: 'Planificación de Rutas Seguras',
          description: 'Encuentra el camino más seguro a tu destino.'
        },
        community: {
          title: 'Inteligencia Comunitaria',
          description: 'Reportes anónimos con validación ponderada por confianza.'
        },
        insights: {
          title: 'Perspectivas para ONG y Políticas',
          description: 'Paneles basados en datos para planificación de intervenciones.'
        }
      },
      map: {
        searchPlaceholder: 'Buscar ubicación...',
        timeOfDay: 'Hora del Día',
        morning: 'Mañana',
        evening: 'Tarde',
        night: 'Noche',
        safetyScore: 'Puntuación de Seguridad',
        reportIncident: 'Reportar Incidente',
        planRoute: 'Planear Ruta',
        filters: 'Filtros'
      },
      report: {
        title: 'Reportar Señal de Seguridad',
        subtitle: 'Tu reporte anónimo ayuda a mantener segura a la comunidad',
        incidentType: 'Tipo de Incidente',
        severity: 'Gravedad',
        low: 'Baja',
        medium: 'Media',
        high: 'Alta',
        description: 'Descripción (Opcional)',
        submit: 'Enviar Reporte',
        success: '¡Gracias! Tu reporte ha sido registrado.'
      }
    }
  },
  fr: {
    translation: {
      nav: {
        home: 'Accueil',
        map: 'Carte de Sécurité',
        report: 'Signaler',
        about: 'À Propos',
        login: 'Connexion',
        dashboard: 'Tableau de Bord'
      },
      hero: {
        title: 'Intelligence de Sécurité pour Tous',
        subtitle: 'Naviguez dans votre ville en toute confiance. Informations de sécurité en temps réel.',
        cta: 'Explorer la Carte',
        secondaryCta: 'En Savoir Plus'
      },
      map: {
        searchPlaceholder: 'Rechercher un lieu...',
        timeOfDay: 'Heure de la Journée',
        morning: 'Matin',
        evening: 'Soir',
        night: 'Nuit'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
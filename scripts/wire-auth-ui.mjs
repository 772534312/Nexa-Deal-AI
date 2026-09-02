import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('src/App.tsx');
let source = fs.readFileSync(file, 'utf8');

function replaceOnce(label, oldText, newText) {
  if (!source.includes(oldText)) throw new Error(`[Nexa UI auth] Missing pattern: ${label}`);
  source = source.replace(oldText, newText);
}

replaceOnce(
  'auth import',
  "import { PublicLandingPage } from './components/PublicLandingPage';",
  "import { PublicLandingPage } from './components/PublicLandingPage';\nimport { AuthModal } from './components/AuthModal';"
);

replaceOnce(
  'auth state',
  "  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);",
  "  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);\n  const [isAuthenticated, setIsAuthenticated] = useState(false);\n  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);\n  const [authDestination, setAuthDestination] = useState<'dashboard' | 'projects'>('dashboard');"
);

replaceOnce(
  'initial fetch effect',
  "  useEffect(() => {\n    fetchAllData();\n  }, []);",
  "  useEffect(() => {\n    let cancelled = false;\n    fetch('/api/auth/session', { credentials: 'include' })\n      .then(async response => ({ ok: response.ok, data: await response.json() }))\n      .then(({ ok, data }) => {\n        if (cancelled) return;\n        if (ok && data.authenticated) {\n          setIsAuthenticated(true);\n          setCurrentUser(data.user);\n          setWorkspace(data.workspace);\n          fetchAllData();\n        }\n      })\n      .catch(() => undefined);\n    return () => { cancelled = true; };\n  }, []);"
);

replaceOnce(
  'landing actions',
  "          onStartSellerOnboarding={() => {\n            setActiveTab('projects');\n            setIsAddProjectOpen(true);\n          }}\n          onExploreAcquisitions={() => {\n            setActiveTab('marketplace');\n          }}\n          onLaunchWorkspace={() => {\n            setActiveTab('dashboard');\n          }}",
  "          onStartSellerOnboarding={() => {\n            setAuthDestination('projects');\n            if (isAuthenticated) {\n              setActiveTab('projects');\n              setIsAddProjectOpen(true);\n            } else {\n              setIsAuthModalOpen(true);\n            }\n          }}\n          onExploreAcquisitions={() => {\n            setActiveTab('marketplace');\n          }}\n          onLaunchWorkspace={() => {\n            setAuthDestination('dashboard');\n            if (isAuthenticated) setActiveTab('dashboard');\n            else setIsAuthModalOpen(true);\n          }}"
);

replaceOnce(
  'auth modal render',
  "    <div className=\"min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans\">",
  "    <div className=\"min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans\">\n      {isAuthModalOpen && (\n        <AuthModal\n          initialMode={authDestination === 'projects' ? 'register' : 'login'}\n          onClose={() => setIsAuthModalOpen(false)}\n          onAuthenticated={({ user, workspace }) => {\n            setIsAuthenticated(true);\n            setCurrentUser(user);\n            setWorkspace(workspace);\n            setIsAuthModalOpen(false);\n            setActiveTab(authDestination);\n            fetchAllData();\n            if (authDestination === 'projects') setIsAddProjectOpen(true);\n          }}\n        />\n      )}"
);

fs.writeFileSync(file, source, 'utf8');
console.log('[Nexa UI auth] Authentication flow connected.');

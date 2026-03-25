import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaYoutube,
  FaArrowRight,
} from "react-icons/fa";

const footerLinks = {
  solutions: ["Marketing", "Analytics", "Commerce", "Insights"],
  support: ["Pricing", "Documentation", "Guides", "API Status"],
  company: ["About", "Blog", "Jobs", "Press", "Partners"],
  legal: ["Privacy", "Terms", "Cookies"],
};

const socialLinks = [
  { icon: FaFacebook, href: "#", label: "Facebook" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaTwitter, href: "#", label: "Twitter" },
  { icon: FaGithub, href: "#", label: "GitHub" },
  { icon: FaYoutube, href: "#", label: "YouTube" },
];

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-zinc-950 border-t border-white/[0.06] text-zinc-400">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top row: brand + newsletter */}
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          {/* Brand */}
          <div className="lg:w-1/3 space-y-5">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-glow-sm">
                <span className="text-white font-display font-bold text-sm">
                  e
                </span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                eShop
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              {t("footer_description")}
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ y: -2, color: "#10b981" }}
                  transition={{ duration: 0.2 }}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-colors duration-200"
                >
                  <Icon size={14} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links grid */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
                  {t(section)}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-zinc-500 hover:text-emerald-400 transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-12"
        >
          <div>
            <p className="text-white font-semibold text-sm">Stay in the loop</p>
            <p className="text-zinc-500 text-xs mt-0.5">
              Get the latest deals and product drops.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 sm:w-64 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition"
            />
            <button className="p-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl transition-colors duration-200">
              <FaArrowRight size={14} />
            </button>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.06]">
          <p className="text-xs text-zinc-600">&copy; {t("copyright")}</p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Sitemap"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

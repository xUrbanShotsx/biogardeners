"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, CheckCircle, Send, MapPin } from "lucide-react";
import { Nav }    from "@/components/nav";
import { Footer } from "@/components/footer";

type Field = "firstName" | "lastName" | "mobile" | "email" | "notes";

type FormData = Record<Field, string>;
type FormErrors = Partial<Record<Field, string>>;

const INITIAL: FormData = { firstName: "", lastName: "", mobile: "", email: "", notes: "" };

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.firstName.trim())                        errors.firstName = "First name is required";
  if (!data.lastName.trim())                         errors.lastName  = "Last name is required";
  if (!data.email.trim())                            errors.email     = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Enter a valid email address";
  if (data.mobile && !/^[\d\s\+\-\(\)]{6,15}$/.test(data.mobile)) errors.mobile = "Enter a valid phone number";
  return errors;
}

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export default function ContactPage() {
  const [form,    setForm]    = useState<FormData>(INITIAL);
  const [errors,  setErrors]  = useState<FormErrors>({});
  const [status,  setStatus]  = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});

  function handleChange(field: Field, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (touched[field]) {
      const errs = validate({ ...form, [field]: value });
      setErrors((e) => ({ ...e, [field]: errs[field] }));
    }
  }

  function handleBlur(field: Field) {
    setTouched((t) => ({ ...t, [field]: true }));
    const errs = validate(form);
    setErrors((e) => ({ ...e, [field]: errs[field] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setTouched({ firstName: true, lastName: true, mobile: true, email: true, notes: true });
    if (Object.keys(errs).length) return;

    setStatus("sending");
    // Simulate submission — replace with your email service (e.g. Resend, Formspree)
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("sent");
  }

  const inputBase: React.CSSProperties = {
    width:        "100%",
    borderRadius: "var(--radius-input)",
    border:       "1.5px solid var(--input-border)",
    padding:      "12px 14px",
    fontSize:     "0.9375rem",
    fontFamily:   "var(--font-primary)",
    color:        "var(--text-black)",
    background:   "#fff",
    outline:      "none",
    transition:   "border-color 180ms ease",
  };

  function inputStyle(field: Field): React.CSSProperties {
    return {
      ...inputBase,
      borderColor: errors[field] ? "var(--red)" : touched[field] && !errors[field] ? "var(--green-accent)" : "var(--input-border)",
    };
  }

  return (
    <>
      <Nav />
      <main style={{ background: "var(--canvas)", paddingTop: "var(--nav-h)" }}>

        {/* Header band */}
        <div style={{ background: "var(--green-house)" }} className="px-6 lg:px-10 py-14">
          <div className="max-w-[1440px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}>
              <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
                Get in touch
              </p>
              <h1 className="font-bold mb-3" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", color: "#fff", letterSpacing: "-0.02em" }}>
                Contact us
              </h1>
              <p className="text-base max-w-md" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>
                Questions about an order, a product, or just want some advice? We'd love to hear from you.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-16 items-start">

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            >
              <AnimatePresence mode="wait">
                {status === "sent" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="flex flex-col items-center text-center rounded-2xl p-12"
                    style={{ background: "var(--green-xlight)", border: "1px solid var(--green-light)" }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                      style={{ background: "var(--green-accent)" }}
                    >
                      <CheckCircle size={30} color="#fff" />
                    </div>
                    <h2 className="font-bold text-2xl mb-3" style={{ color: "var(--green-house)", letterSpacing: "-0.01em" }}>
                      Message sent!
                    </h2>
                    <p className="text-sm max-w-sm" style={{ color: "var(--text-black-soft)", lineHeight: 1.7 }}>
                      Thanks for getting in touch, {form.firstName}. We'll get back to you at{" "}
                      <strong style={{ color: "var(--text-black)" }}>{form.email}</strong> within 1–2 business days.
                    </p>
                    <button
                      onClick={() => { setForm(INITIAL); setErrors({}); setTouched({}); setStatus("idle"); }}
                      className="btn btn-outline mt-8"
                      style={{ fontSize: 14, padding: "10px 24px" }}
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-col gap-5"
                  >
                    {/* Name row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="firstName" className="text-sm font-semibold" style={{ color: "var(--text-black)" }}>
                          First name <span style={{ color: "var(--red)" }}>*</span>
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          autoComplete="given-name"
                          placeholder="Jane"
                          value={form.firstName}
                          onChange={(e) => handleChange("firstName", e.target.value)}
                          onBlur={() => handleBlur("firstName")}
                          style={inputStyle("firstName")}
                        />
                        {errors.firstName && (
                          <p className="text-xs" style={{ color: "var(--red)" }}>{errors.firstName}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="lastName" className="text-sm font-semibold" style={{ color: "var(--text-black)" }}>
                          Last name <span style={{ color: "var(--red)" }}>*</span>
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          autoComplete="family-name"
                          placeholder="Smith"
                          value={form.lastName}
                          onChange={(e) => handleChange("lastName", e.target.value)}
                          onBlur={() => handleBlur("lastName")}
                          style={inputStyle("lastName")}
                        />
                        {errors.lastName && (
                          <p className="text-xs" style={{ color: "var(--red)" }}>{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-sm font-semibold" style={{ color: "var(--text-black)" }}>
                        Email <span style={{ color: "var(--red)" }}>*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="jane@example.com"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        style={inputStyle("email")}
                      />
                      {errors.email && (
                        <p className="text-xs" style={{ color: "var(--red)" }}>{errors.email}</p>
                      )}
                    </div>

                    {/* Mobile */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="mobile" className="text-sm font-semibold" style={{ color: "var(--text-black)" }}>
                        Mobile <span className="text-xs font-normal" style={{ color: "var(--text-black-soft)" }}>(optional)</span>
                      </label>
                      <input
                        id="mobile"
                        type="tel"
                        autoComplete="tel"
                        placeholder="04xx xxx xxx"
                        value={form.mobile}
                        onChange={(e) => handleChange("mobile", e.target.value)}
                        onBlur={() => handleBlur("mobile")}
                        style={inputStyle("mobile")}
                      />
                      {errors.mobile && (
                        <p className="text-xs" style={{ color: "var(--red)" }}>{errors.mobile}</p>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="notes" className="text-sm font-semibold" style={{ color: "var(--text-black)" }}>
                        Message <span className="text-xs font-normal" style={{ color: "var(--text-black-soft)" }}>(optional)</span>
                      </label>
                      <textarea
                        id="notes"
                        rows={5}
                        placeholder="Tell us how we can help — order questions, product advice, anything at all."
                        value={form.notes}
                        onChange={(e) => handleChange("notes", e.target.value)}
                        style={{
                          ...inputBase,
                          resize:    "vertical",
                          minHeight: "120px",
                        }}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="btn btn-primary self-start gap-2"
                      style={{ fontSize: 15, padding: "13px 28px", opacity: status === "sending" ? 0.75 : 1 }}
                    >
                      {status === "sending" ? (
                        <>Sending…</>
                      ) : (
                        <><Send size={15} /> Send message</>
                      )}
                    </button>

                    {status === "error" && (
                      <p className="text-sm" style={{ color: "var(--red)" }}>
                        Something went wrong. Please try again or email us directly at hello@biogardeners.com.au.
                      </p>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Contact info sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              className="flex flex-col gap-5"
            >
              {[
                {
                  icon:  Mail,
                  label: "Email",
                  value: "hello@biogardeners.com.au",
                  sub:   "We reply within 1–2 business days",
                  href:  "mailto:hello@biogardeners.com.au",
                },
                {
                  icon:  Phone,
                  label: "Phone",
                  value: "Available by request",
                  sub:   "Leave your number and we'll call you back",
                  href:  null,
                },
                {
                  icon:  MapPin,
                  label: "Location",
                  value: "Australia-wide",
                  sub:   "We ship to every state and territory",
                  href:  null,
                },
              ].map(({ icon: Icon, label, value, sub, href }) => (
                <div
                  key={label}
                  className="flex gap-4 rounded-2xl p-5"
                  style={{ background: "var(--surface-alt)", border: "1px solid var(--ceramic)" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "var(--green-xlight)" }}
                  >
                    <Icon size={17} style={{ color: "var(--green-accent)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.08em] mb-0.5" style={{ color: "var(--text-black-soft)" }}>{label}</p>
                    {href ? (
                      <a href={href} className="text-sm font-semibold transition-colors duration-150 hover:underline" style={{ color: "var(--green-bio)" }}>
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold" style={{ color: "var(--text-black)" }}>{value}</p>
                    )}
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-black-soft)" }}>{sub}</p>
                  </div>
                </div>
              ))}

              {/* Response time card */}
              <div
                className="rounded-2xl p-5 mt-2"
                style={{ background: "var(--green-house)" }}
              >
                <p className="font-bold text-sm mb-1" style={{ color: "#fff" }}>Business hours</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                  Monday – Friday<br />
                  9:00am – 5:00pm AEST
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

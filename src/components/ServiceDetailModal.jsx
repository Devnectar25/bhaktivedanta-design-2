import React, { useState, useEffect } from "react";
import {
    X,
    ClipboardList,
    Stethoscope,
    ShieldCheck,
    CheckCircle2,
    Star,
    Quote,
    User,
    ZoomIn,
    Maximize2,
    Minimize2,
    HeartHandshake,
    GraduationCap,
    Compass,
    Sun,
    Calendar,
    BookOpen,
    Search,
    ArrowLeft,
} from "lucide-react";
import RichTextRenderer from "./RichTextRenderer/RichTextRenderer";
import { TabSectionsRenderer, LogoGridSection } from "./SectionRenderer/SectionRenderer";
import AcronymBreakdown from "./AcronymBreakdown/AcronymBreakdown";
import ActivityImageCard from "./ActivityImageCard/ActivityImageCard";
import ContactInfoBlock from "./ContactInfoBlock/ContactInfoBlock";
import PublicationCard from "./PublicationCard/PublicationCard";
import ProgramCard from "./ProgramCard/ProgramCard";
import FlexibleDetailPage from "./FlexibleDetailPage/FlexibleDetailPage";
import { getSpiritualCareState, getServicesState } from "../utils/api";
import { defaultSpiritualCareState } from "../data/defaultSpiritualCare";
import { defaultServicesState, ensureStandardServiceTabs } from "../data/defaultServices";

/* ------------------------------------------------------------------ */
/*  Design tokens — matches hospital brand (navy + orange accent)      */
/*  elevated with Fraunces serif headings & Work Sans typography       */
/* ------------------------------------------------------------------ */
const tokens = {
    navy: "#132A4C",
    navyLight: "#3B5A82",
    orange: "#E8792B",
    ink: "#1E2733",
    muted: "#6B7280",
    border: "#E7EAF0",
    panel: "#F7F9FC",
    ivory: "#FFFFFF",
};

const stepIcons = [ClipboardList, Stethoscope, ShieldCheck];

/* ------------------------------------------------------------------ */
/*  Reusable: TabNav (underline style, smooth horizontal scroll)       */
/* ------------------------------------------------------------------ */
function TabNav({ tabs, active, onChange }) {
    return (
        <div
            style={{
                display: "flex",
                gap: 28,
                borderBottom: `1px solid ${tokens.border}`,
                padding: "0 32px",
                overflowX: "auto",
                scrollbarWidth: "none",
                flexShrink: 0,
            }}
        >
            {tabs.map((t) => {
                const isActive = t.label === active;
                return (
                    <button
                        key={t.label}
                        type="button"
                        onClick={() => onChange(t.label)}
                        style={{
                            fontFamily: "'Work Sans', sans-serif",
                            fontSize: 15,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            color: isActive ? tokens.navy : "#9AA3B2",
                            background: "none",
                            border: "none",
                            padding: "16px 0 14px",
                            cursor: "pointer",
                            borderBottom: isActive
                                ? `2.5px solid ${tokens.orange}`
                                : "2.5px solid transparent",
                            marginBottom: -1,
                            transition: "color 0.15s ease, border-color 0.15s ease",
                        }}
                    >
                        {t.label}
                    </button>
                );
            })}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Helper: Convert TipTap Doc / HTML / String to node array or HTML   */
/* ------------------------------------------------------------------ */
function parseRichTextContent(content) {
    if (!content) return [];
    if (Array.isArray(content)) return content;

    // TipTap Doc format
    if (typeof content === "object" && content.type === "doc" && Array.isArray(content.content)) {
        return content;
    }

    return content;
}

/* ------------------------------------------------------------------ */
/*  Renderer: Overview & Rich Text Tabs (delegates to RichTextRenderer)*/
/* ------------------------------------------------------------------ */
function OverviewRenderer({ content }) {
    if (!content || (Array.isArray(content) && content.length === 0)) {
        return (
            <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 15, color: tokens.muted }}>
                Comprehensive clinical care and medical services tailored for patient wellness.
            </p>
        );
    }

    return <RichTextRenderer content={content} />;
}

/* ------------------------------------------------------------------ */
/*  Renderer: How It Works (numbered steps with icon + connector)      */
/* ------------------------------------------------------------------ */
function StepsRenderer({ steps = [] }) {
    if (!steps || steps.length === 0) {
        return (
            <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 15, color: tokens.muted }}>
                No clinical workflow steps configured yet.
            </p>
        );
    }

    return (
        <div style={{ position: "relative" }}>
            {steps.map((s, i) => {
                const Icon = stepIcons[i % stepIcons.length];
                const isLast = i === steps.length - 1;
                return (
                    <div
                        key={i}
                        style={{
                            display: "flex",
                            gap: 20,
                            position: "relative",
                            paddingBottom: isLast ? 0 : 30,
                        }}
                    >
                        {!isLast && (
                            <div
                                style={{
                                    position: "absolute",
                                    left: 21,
                                    top: 46,
                                    bottom: 0,
                                    width: 2,
                                    background: tokens.border,
                                }}
                            />
                        )}
                        <div
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: "50%",
                                background: tokens.navy,
                                color: tokens.ivory,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                zIndex: 1,
                            }}
                        >
                            <Icon size={19} strokeWidth={1.8} />
                        </div>
                        <div style={{ paddingTop: 6, flex: 1 }}>
                            <span
                                style={{
                                    fontFamily: "'Work Sans', sans-serif",
                                    fontSize: 12.5,
                                    fontWeight: 700,
                                    color: tokens.orange,
                                    letterSpacing: "0.03em",
                                }}
                            >
                                STEP {i + 1}
                            </span>
                            <h4
                                style={{
                                    fontFamily: "'Fraunces', serif",
                                    fontWeight: 600,
                                    fontSize: 17.5,
                                    color: tokens.navy,
                                    margin: "4px 0 6px",
                                }}
                            >
                                {s.title || `Phase ${i + 1}`}
                            </h4>
                            <div
                                style={{
                                    fontFamily: "'Work Sans', sans-serif",
                                    fontSize: 14.5,
                                    color: tokens.muted,
                                    lineHeight: 1.65,
                                    margin: 0,
                                    maxWidth: 680,
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: typeof s.description === "string" ? s.description : "",
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Renderer: Key Highlights (grid of feature badges)                  */
/* ------------------------------------------------------------------ */
function HighlightsRenderer({ items = [] }) {
    if (!items || items.length === 0) {
        return (
            <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 15, color: tokens.muted }}>
                No highlights listed yet.
            </p>
        );
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 14,
            }}
        >
            {items.map((h, i) => {
                const text = typeof h === "string" ? h : h.text || h.title || h.description || "";
                return (
                    <div
                        key={i}
                        style={{
                            display: "flex",
                            gap: 14,
                            alignItems: "flex-start",
                            background: tokens.panel,
                            border: `1px solid ${tokens.border}`,
                            borderRadius: 12,
                            padding: "18px 20px",
                        }}
                    >
                        <CheckCircle2
                            size={20}
                            color={tokens.orange}
                            strokeWidth={2}
                            style={{ flexShrink: 0, marginTop: 1 }}
                        />
                        <span
                            style={{
                                fontFamily: "'Work Sans', sans-serif",
                                fontSize: 15,
                                color: tokens.ink,
                                lineHeight: 1.5,
                            }}
                        >
                            {text}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Renderer: Specialists & Cards (Doctor Profiles or Amenity Badges)  */
/* ------------------------------------------------------------------ */
function SpecialistsRenderer({ items = [] }) {
    if (!items || items.length === 0) {
        return (
            <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 15, color: tokens.muted }}>
                Details available on request.
            </p>
        );
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 16,
            }}
        >
            {items.map((s, i) => {
                const title = s.name || s.title || "Specialist";
                const subtitle = s.role || s.tag || "";
                const description = s.qualification || s.description || "";
                const photo = s.photo || s.image || "";
                const icon = s.icon || "";

                return (
                    <div
                        key={i}
                        style={{
                            display: "flex",
                            gap: 18,
                            border: `1px solid ${tokens.border}`,
                            borderRadius: 14,
                            padding: 20,
                            alignItems: "center",
                            background: tokens.ivory,
                        }}
                    >
                        <div
                            style={{
                                width: 72,
                                height: 72,
                                borderRadius: photo ? "50%" : 12,
                                overflow: "hidden",
                                background: tokens.panel,
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: `2px solid ${tokens.border}`,
                                color: tokens.navy,
                            }}
                        >
                            {photo ? (
                                <img
                                    src={photo}
                                    alt={title}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : icon ? (
                                <span className="material-symbols-outlined" style={{ fontSize: 30, color: tokens.orange }}>
                                    {icon}
                                </span>
                            ) : (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "100%",
                                        height: "100%",
                                        color: tokens.navyLight,
                                    }}
                                >
                                    <User size={32} />
                                </div>
                            )}
                        </div>
                        <div style={{ flex: 1, minWidth: 160 }}>
                            <h4
                                style={{
                                    fontFamily: "'Fraunces', serif",
                                    fontWeight: 600,
                                    fontSize: 17.5,
                                    color: tokens.navy,
                                    margin: "0 0 4px",
                                }}
                            >
                                {title}
                            </h4>
                            {subtitle && (
                                <p
                                    style={{
                                        fontFamily: "'Work Sans', sans-serif",
                                        fontSize: 13,
                                        color: tokens.orange,
                                        fontWeight: 600,
                                        margin: "0 0 4px",
                                    }}
                                >
                                    {subtitle}
                                </p>
                            )}
                            {description && (
                                <p
                                    style={{
                                        fontFamily: "'Work Sans', sans-serif",
                                        fontSize: 13.5,
                                        color: tokens.muted,
                                        margin: 0,
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Renderer: FAQs (Accordion List)                                    */
/* ------------------------------------------------------------------ */
function FaqRenderer({ items = [] }) {
    const [openIdx, setOpenIdx] = useState(0);

    if (!items || items.length === 0) {
        return (
            <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 15, color: tokens.muted }}>
                Frequently asked questions will be updated shortly.
            </p>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map((faq, i) => {
                const isOpen = openIdx === i;
                const question = faq.question || faq.title || faq.q || "";
                const answer = faq.answer || faq.description || faq.content || faq.a || "";

                return (
                    <div
                        key={i}
                        style={{
                            border: `1px solid ${tokens.border}`,
                            borderRadius: 12,
                            background: tokens.ivory,
                            overflow: "hidden",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setOpenIdx(isOpen ? -1 : i)}
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "16px 20px",
                                background: isOpen ? tokens.panel : "transparent",
                                border: "none",
                                cursor: "pointer",
                                textAlign: "left",
                                fontFamily: "'Fraunces', serif",
                                fontSize: 16,
                                fontWeight: 600,
                                color: tokens.navy,
                            }}
                        >
                            <span>{question}</span>
                            <span
                                style={{
                                    color: tokens.orange,
                                    fontWeight: 700,
                                    fontSize: 18,
                                    marginLeft: 12,
                                }}
                            >
                                {isOpen ? "−" : "+"}
                            </span>
                        </button>
                        {isOpen && (
                            <div
                                style={{
                                    padding: "14px 20px 18px",
                                    fontFamily: "'Work Sans', sans-serif",
                                    fontSize: 14.5,
                                    color: tokens.muted,
                                    lineHeight: 1.65,
                                    borderTop: `1px solid ${tokens.border}`,
                                }}
                            >
                                {answer}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Renderer: Testimonials (Patient Stories & Ratings)                 */
/* ------------------------------------------------------------------ */
function TestimonialsRenderer({ items = [] }) {
    if (!items || items.length === 0) {
        return (
            <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 15, color: tokens.muted }}>
                No patient testimonials recorded yet.
            </p>
        );
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 18,
            }}
        >
            {items.map((t, i) => (
                <div
                    key={i}
                    style={{
                        background: tokens.ivory,
                        border: `1px solid ${tokens.border}`,
                        borderRadius: 14,
                        padding: 22,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                        {Array.from({ length: t.rating || 5 }).map((_, j) => (
                            <Star
                                key={j}
                                size={14}
                                fill={tokens.orange}
                                color={tokens.orange}
                            />
                        ))}
                    </div>
                    <Quote size={18} color={tokens.navyLight} style={{ marginBottom: 8 }} />
                    <p
                        style={{
                            fontFamily: "'Fraunces', serif",
                            fontStyle: "italic",
                            fontSize: 15,
                            color: tokens.ink,
                            lineHeight: 1.65,
                            margin: "0 0 16px",
                            flex: 1,
                        }}
                    >
                        "{t.quote}"
                    </p>
                    <div style={{ height: 1, background: tokens.border, marginBottom: 12 }} />
                    <span
                        style={{
                            fontFamily: "'Work Sans', sans-serif",
                            fontWeight: 700,
                            fontSize: 13.5,
                            color: tokens.navy,
                        }}
                    >
                        {t.author}
                    </span>
                    <div
                        style={{
                            fontFamily: "'Work Sans', sans-serif",
                            fontSize: 12.5,
                            color: tokens.muted,
                        }}
                    >
                        {t.location}
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Renderer: Photo Gallery (Grid with Lightbox Preview)               */
/* ------------------------------------------------------------------ */
function GalleryRenderer({ items = [] }) {
    const [selectedImg, setSelectedImg] = useState(null);

    if (!items || items.length === 0) {
        return (
            <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 15, color: tokens.muted }}>
                No facility photos in this gallery yet.
            </p>
        );
    }

    return (
        <>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 14,
                }}
            >
                {items.map((g, i) => {
                    const imgUrl = typeof g === "string" ? g : g.image || g.url;
                    const caption = typeof g === "object" ? g.caption : "";
                    if (!imgUrl) return null;

                    return (
                        <div
                            key={i}
                            onClick={() => setSelectedImg({ url: imgUrl, caption })}
                            style={{
                                position: "relative",
                                borderRadius: 12,
                                overflow: "hidden",
                                aspectRatio: "4/3",
                                background: tokens.panel,
                                cursor: "pointer",
                                border: `1px solid ${tokens.border}`,
                                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.02)";
                                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <img
                                src={imgUrl}
                                alt={caption || "Facility photo"}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    padding: "18px 14px 10px",
                                    background: `linear-gradient(to top, ${tokens.navy}E6, transparent)`,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-end",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "'Work Sans', sans-serif",
                                        color: "#fff",
                                        fontSize: 13.5,
                                        fontWeight: 600,
                                    }}
                                >
                                    {caption || "View Image"}
                                </span>
                                <ZoomIn size={16} color="#fff" style={{ opacity: 0.8 }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Lightbox Overlay */}
            {selectedImg && (
                <div
                    onClick={() => setSelectedImg(null)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 100000,
                        background: "rgba(0,0,0,0.85)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 24,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: 900,
                            maxHeight: "90vh",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setSelectedImg(null)}
                            style={{
                                position: "absolute",
                                top: -44,
                                right: 0,
                                background: "rgba(255,255,255,0.2)",
                                border: "none",
                                color: "#fff",
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                            }}
                        >
                            <X size={18} />
                        </button>
                        <img
                            src={selectedImg.url}
                            alt={selectedImg.caption}
                            style={{
                                width: "100%",
                                maxHeight: "80vh",
                                objectFit: "contain",
                                borderRadius: 12,
                            }}
                        />
                        {selectedImg.caption && (
                            <p
                                style={{
                                    color: "#fff",
                                    fontFamily: "'Work Sans', sans-serif",
                                    marginTop: 12,
                                    fontSize: 14.5,
                                    textAlign: "center",
                                }}
                            >
                                {selectedImg.caption}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

/* ------------------------------------------------------------------ */
/*  Spiritual Care Renderers                                          */
/* ------------------------------------------------------------------ */

function SpiritualServicesOverviewRenderer() {
    const [data, setData] = useState(defaultSpiritualCareState.services);

    useEffect(() => {
        getSpiritualCareState(defaultSpiritualCareState).then(res => {
            if (res?.services) setData(res.services);
        });
    }, []);

    const overview = data?.overview || defaultSpiritualCareState.services.overview;
    const matchAcronym = overview?.acronymItems || defaultSpiritualCareState.services.overview.acronymItems;
    const contact = data?.contact || defaultSpiritualCareState.services.contact;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 600, color: tokens.navy, margin: '0 0 16px' }}>
                    {overview?.title || 'Healing Through Spiritual Warmth & Compassion'}
                </h2>
                <div style={{ lineHeight: 1.7, color: '#334155', fontSize: 15 }}>
                    <RichTextRenderer content={overview?.content || ''} />
                </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: 24, borderRadius: 16, border: '1px solid #E2E8F0' }}>
                <AcronymBreakdown
                    title={overview?.acronymTitle || 'Our Core Guiding Values (MATCH)'}
                    subtitle={overview?.acronymSubtitle || 'The foundational pillars that steer our clinical culture, caregiver attitude, and holistic healing environment:'}
                    items={matchAcronym}
                    variant="card"
                />
            </div>

            <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 16, border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: tokens.navy, margin: '0 0 10px' }}>
                    A Sanctuary of Multi-Faith Compassion
                </h3>
                <p style={{ color: '#475569', fontSize: 14.5, lineHeight: 1.6, margin: '0 0 12px' }}>
                    Our spiritual counselors respect and honor all faiths, spiritual traditions, and personal beliefs. Whether offering Vedic chants, silent meditation, scripture reading, or simply a listening heart during moments of distress, our team is dedicated to bringing peace and reassurance to every bedside.
                </p>
                <p style={{ color: '#475569', fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>
                    Spiritual rounds occur daily across ICU, CCU, post-operative recovery, pediatric, and general wards to support both patients and their families.
                </p>
            </div>

            <ContactInfoBlock
                title={contact?.title || 'Spiritual Care Helpline & OPD Desk'}
                phones={contact?.phones || ['+91 22 2845 6000', '+91 22 6188 2200']}
                emergencyPhone={contact?.emergencyPhone}
                days={contact?.days || 'Monday – Sunday (24x7 Available)'}
                timings={contact?.timings || 'Bedside rounds: 8:00 AM – 8:00 PM | Emergency Chaplaincy: 24 Hours'}
                location={contact?.location || 'Ground Floor, Spiritual Care Central Desk'}
                email={contact?.email}
                note={contact?.note}
                variant="card"
            />
        </div>
    );
}

function SpiritualServicesOfferedRenderer() {
    const [data, setData] = useState(defaultSpiritualCareState.services);

    useEffect(() => {
        getSpiritualCareState(defaultSpiritualCareState).then(res => {
            if (res?.services) setData(res.services);
        });
    }, []);

    const patientSupport = (data?.servicesOffered?.patientSupport || defaultSpiritualCareState.services.servicesOffered.patientSupport).filter(i => i.enabled !== false);
    const counselling = (data?.servicesOffered?.counselling || defaultSpiritualCareState.services.servicesOffered.counselling).filter(i => i.enabled !== false);
    const contact = data?.contact || defaultSpiritualCareState.services.contact;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 600, color: tokens.navy, margin: '0 0 8px' }}>
                    Comprehensive Spiritual Care & Pastoral Services
                </h2>
                <p style={{ color: tokens.muted, fontSize: 14.5, margin: '0 0 24px' }}>
                    We provide non-invasive, empathetic spiritual solace tailored to each patient's faith and comfort levels.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                    {/* Patient Support Column */}
                    <div style={{ background: '#F8FAFC', padding: 24, borderRadius: 16, border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #E2E8F0' }}>
                            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#E0F2FE', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle2 size={20} />
                            </div>
                            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: tokens.navy, margin: 0 }}>
                                Patient Support Services
                            </h3>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {patientSupport.map(item => (
                                <li key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: tokens.orange, marginTop: 8, flexShrink: 0 }} />
                                    <div>
                                        <strong style={{ display: 'block', fontSize: 14.5, color: '#1E293B' }}>{item.text}</strong>
                                        {item.note && <span style={{ fontSize: 13, color: '#64748B' }}>{item.note}</span>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Counselling Column */}
                    <div style={{ background: '#F8FAFC', padding: 24, borderRadius: 16, border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #E2E8F0' }}>
                            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle2 size={20} />
                            </div>
                            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: tokens.navy, margin: 0 }}>
                                Spiritual & Psychological Counselling
                            </h3>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {counselling.map(item => (
                                <li key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3B82F6', marginTop: 8, flexShrink: 0 }} />
                                    <div>
                                        <strong style={{ display: 'block', fontSize: 14.5, color: '#1E293B' }}>{item.text}</strong>
                                        {item.note && <span style={{ fontSize: 13, color: '#64748B' }}>{item.note}</span>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <ContactInfoBlock
                title={contact?.title || 'Spiritual Care Helpline & OPD Desk'}
                phones={contact?.phones || ['+91 22 2845 6000', '+91 22 6188 2200']}
                emergencyPhone={contact?.emergencyPhone}
                days={contact?.days || 'Monday – Sunday (24x7 Available)'}
                timings={contact?.timings || 'Bedside rounds: 8:00 AM – 8:00 PM | Emergency Chaplaincy: 24 Hours'}
                location={contact?.location || 'Ground Floor, Spiritual Care Central Desk'}
                email={contact?.email}
                note={contact?.note}
                variant="card"
            />
        </div>
    );
}

function EducationalProgrammesModalRenderer() {
    const [programmes, setProgrammes] = useState(defaultSpiritualCareState.programmes);
    const [selectedProg, setSelectedProg] = useState(null);
    const [garbhaService, setGarbhaService] = useState(null);

    useEffect(() => {
        getSpiritualCareState(defaultSpiritualCareState).then(res => {
            if (res?.programmes && res.programmes.length > 0) {
                setProgrammes(res.programmes);
            }
        });

        getServicesState(defaultServicesState).then(res => {
            const services = res?.services || defaultServicesState.services || [];
            const match = services.find(s => (s.name || '').toLowerCase().includes('garbha') || s.id === 'srv5');
            if (match) {
                ensureStandardServiceTabs(match);
                setGarbhaService(match);
            }
        });
    }, []);

    const handleSelectProgram = (prog) => {
        if (prog.id === 'garbha-samskar' || prog.destinationType === 'existing') {
            setSelectedProg({ type: 'garbha', prog });
        } else {
            setSelectedProg({ type: 'detail', prog });
        }
    };

    if (selectedProg) {
        if (selectedProg.type === 'garbha' && garbhaService) {
            const normalizedGarbha = normalizeServiceData(garbhaService, 'Clinical Services');
            return (
                <div>
                    <button
                        type="button"
                        onClick={() => setSelectedProg(null)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 14px',
                            borderRadius: 8,
                            background: '#F1F5F9',
                            border: '1px solid #E2E8F0',
                            color: '#334155',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginBottom: 20
                        }}
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Educational Programmes</span>
                    </button>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {normalizedGarbha.tabs.map((t) => (
                            <div key={t.id || t.label} style={{ background: '#F8FAFC', padding: 24, borderRadius: 16, border: '1px solid #E2E8F0' }}>
                                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: tokens.navy, marginBottom: 14 }}>
                                    {t.label}
                                </h3>
                                <TabContentRenderer tab={t} />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        const detailPage = selectedProg.prog?.detailPage || {};
        return (
            <div>
                <button
                    type="button"
                    onClick={() => setSelectedProg(null)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 14px',
                        borderRadius: 8,
                        background: '#F1F5F9',
                        border: '1px solid #E2E8F0',
                        color: '#334155',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginBottom: 20
                    }}
                >
                    <ArrowLeft size={16} />
                    <span>Back to Educational Programmes</span>
                </button>

                <FlexibleDetailPage
                    title={detailPage.title || selectedProg.prog?.title}
                    subtitle={detailPage.subtitle || selectedProg.prog?.description}
                    category={detailPage.category || 'Educational Programmes'}
                    bannerImage={detailPage.bannerImage || selectedProg.prog?.image}
                    blocks={detailPage.blocks || []}
                    onBack={() => setSelectedProg(null)}
                    showSharePrint={false}
                />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
                <p style={{ color: tokens.muted, fontSize: 14.5, margin: '0 0 24px', maxWidth: 750 }}>
                    Empowering families, parents, and seekers with timeless wisdom, prenatal science, child psychology, and self-mastery courses conducted by experienced doctors and spiritual educators.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                    {programmes.filter(p => p.enabled !== false).map((prog) => (
                        <ProgramCard
                            key={prog.id}
                            image={prog.image}
                            title={prog.title}
                            description={prog.description}
                            badge={prog.badge}
                            duration={prog.duration}
                            onClick={() => handleSelectProgram(prog)}
                            ctaText={prog.destinationType === 'existing' ? 'Explore Service' : 'View Program Details'}
                        />
                    ))}
                </div>
            </div>

            <ContactInfoBlock
                title="Educational Programmes Desk & Registration"
                phones={['+91 22 2845 6000', '+91 98200 12345']}
                days="Monday – Saturday"
                timings="9:30 AM – 5:30 PM"
                location="Education Wing, 3rd Floor, Bhaktivedanta Hospital"
                email="programmes@bhaktivedantahospital.com"
                note="Prior registration is recommended as batch sizes are limited to ensure personalized attention."
                variant="card"
            />
        </div>
    );
}

function SpiritualRetreatsBiMonthlyRenderer() {
    const [retreatsData, setRetreatsData] = useState(defaultSpiritualCareState.retreats);

    useEffect(() => {
        getSpiritualCareState(defaultSpiritualCareState).then(res => {
            if (res?.retreats) setRetreatsData(res.retreats);
        });
    }, []);

    const bimonthly = retreatsData?.bimonthly || defaultSpiritualCareState.retreats.bimonthly;
    const contact = retreatsData?.contact || defaultSpiritualCareState.retreats.contact;
    const activities = (bimonthly?.activities || defaultSpiritualCareState.retreats.bimonthly.activities).filter(a => a.enabled !== false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 600, color: tokens.navy, margin: '0 0 10px' }}>
                    {bimonthly?.title || 'Weekend Eco-Wellness & Spiritual Immersion'}
                </h2>
                <p style={{ color: '#475569', fontSize: 14.5, lineHeight: 1.6, margin: '0 0 24px' }}>
                    {bimonthly?.intro || 'Held every two months at tranquil retreat sanctuaries near Mumbai and Thane, our 2-day residential retreats are designed for patients, recovering individuals, families, and healthcare professionals seeking comprehensive physical and spiritual recharge.'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
                    {activities.map((act) => (
                        <ActivityImageCard
                            key={act.id}
                            image={act.image}
                            title={act.title}
                            tag={act.tag}
                            caption={act.caption}
                            aspectRatio="16/10"
                        />
                    ))}
                </div>
            </div>

            <ContactInfoBlock
                title={contact?.title || 'Bi-Monthly Retreat Registration Desk'}
                phones={contact?.phones || ['+91 22 2845 6000', '+91 98200 54321']}
                days={contact?.days || 'Monday – Saturday'}
                timings={contact?.timings || '9:00 AM – 6:00 PM'}
                location={contact?.location || 'Spiritual Care Wing, Bhaktivedanta Hospital'}
                email={contact?.email || 'retreats@bhaktivedantahospital.com'}
                note={contact?.note || 'Early bird registration is recommended as retreat accommodation capacity is limited to 40 participants per batch.'}
                variant="card"
            />
        </div>
    );
}

function SpiritualRetreatsAnnualRenderer() {
    const [retreatsData, setRetreatsData] = useState(defaultSpiritualCareState.retreats);

    useEffect(() => {
        getSpiritualCareState(defaultSpiritualCareState).then(res => {
            if (res?.retreats) setRetreatsData(res.retreats);
        });
    }, []);

    const annual = retreatsData?.annual || defaultSpiritualCareState.retreats.annual;
    const contact = retreatsData?.contact || defaultSpiritualCareState.retreats.contact;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 600, color: tokens.navy, margin: '0 0 14px' }}>
                    {annual?.title || 'Holy Dhams & Sacred Pilgrimage (Annual Yatra)'}
                </h2>
                <div style={{ color: '#334155', fontSize: 14.5, lineHeight: 1.7 }}>
                    <RichTextRenderer content={annual?.content || ''} />
                </div>
            </div>

            <ContactInfoBlock
                title={contact?.title || 'Annual Yatra Coordination Desk'}
                phones={contact?.phones || ['+91 22 2845 6000', '+91 98200 54321']}
                days={contact?.days || 'Monday – Saturday'}
                timings={contact?.timings || '9:00 AM – 6:00 PM'}
                location={contact?.location || 'Spiritual Care Wing, Bhaktivedanta Hospital'}
                email={contact?.email || 'yatra@bhaktivedantahospital.com'}
                note="Medical screening and fitness clearance are provided by our physicians prior to yatra departure."
                variant="card"
            />
        </div>
    );
}

function PublicationsModalRenderer() {
    const [publications, setPublications] = useState(defaultSpiritualCareState.publications);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getSpiritualCareState(defaultSpiritualCareState).then(res => {
            if (res?.publications) setPublications(res.publications);
        });
    }, []);

    const filteredPubs = publications.filter(p =>
        (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(p.authors) ? p.authors.join(' ') : p.authors || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.journal || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
                <p style={{ color: tokens.muted, fontSize: 14.5, margin: '0 0 20px', maxWidth: 750 }}>
                    Demonstrating the therapeutic power of spiritual care through rigorous scientific research, randomized controlled trials, and peer-reviewed clinical literature.
                </p>

                {/* Search Input */}
                <div style={{ position: 'relative', maxWidth: 450, marginBottom: 20 }}>
                    <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input
                        type="text"
                        placeholder="Search publications by title, author, journal..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 14px 10px 40px',
                            borderRadius: 10,
                            border: '1px solid #CBD5E1',
                            fontFamily: "'Work Sans', sans-serif",
                            fontSize: 14,
                            outline: 'none',
                            background: '#FFFFFF',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                        }}
                    />
                </div>

                {/* Publications List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {filteredPubs.length > 0 ? (
                        filteredPubs.map(pub => (
                            <PublicationCard
                                key={pub.id}
                                thumbnail={pub.thumbnail}
                                title={pub.title}
                                url={pub.url}
                                authors={pub.authors}
                                journal={pub.journal}
                                year={pub.year}
                                volume={pub.volume}
                                doi={pub.doi}
                                abstract={pub.abstract}
                            />
                        ))
                    ) : (
                        <div style={{ padding: 32, textAlign: 'center', background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                            <p style={{ color: '#64748B', margin: 0, fontSize: 14 }}>No publications found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>

            <ContactInfoBlock
                title="Department of Medical Research & Ethics Committee"
                phones={['+91 22 2845 6000', '+91 22 6188 2200']}
                days="Monday – Friday"
                timings="9:00 AM – 5:00 PM"
                location="Research Wing, 4th Floor, Bhaktivedanta Hospital"
                email="research@bhaktivedantahospital.com"
                note="Researchers and clinicians interested in collaborating on spiritual care and palliative outcome studies are invited to contact the ethics board."
                variant="card"
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Dynamic Renderers for Custom Admin-Defined Sections               */
/* ------------------------------------------------------------------ */
function DynamicTabBlocksRenderer({ tab }) {
    if (Array.isArray(tab.blocks) && tab.blocks.length > 0) {
        return (
            <FlexibleDetailPage
                title={tab.title || tab.label}
                blocks={tab.blocks}
                showSharePrint={false}
            />
        );
    }
    if (tab.overview?.content) {
        return <RichTextRenderer content={tab.overview.content} />;
    }
    return <OverviewRenderer content={tab.content} />;
}

function DynamicCardGridRenderer({ tab }) {
    const [selectedCard, setSelectedCard] = useState(null);
    const cards = (tab.cards || []).filter(c => c.enabled !== false);
    const contact = tab.contact;

    if (selectedCard) {
        const detailPage = selectedCard.detailPage || {};
        return (
            <div>
                <button
                    type="button"
                    onClick={() => setSelectedCard(null)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 14px',
                        borderRadius: 8,
                        background: '#F1F5F9',
                        border: '1px solid #E2E8F0',
                        color: '#334155',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginBottom: 20
                    }}
                >
                    <ArrowLeft size={16} />
                    <span>Back to {tab.label || 'Cards'}</span>
                </button>

                <FlexibleDetailPage
                    title={detailPage.title || selectedCard.title}
                    subtitle={detailPage.subtitle || selectedCard.description}
                    category={detailPage.category || tab.label || 'Program Details'}
                    bannerImage={detailPage.bannerImage || selectedCard.image}
                    blocks={detailPage.blocks || []}
                    onBack={() => setSelectedCard(null)}
                    showSharePrint={false}
                />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                {cards.map((card) => (
                    <ProgramCard
                        key={card.id}
                        image={card.image}
                        title={card.title}
                        description={card.description}
                        badge={card.badge}
                        duration={card.duration}
                        onClick={() => setSelectedCard(card)}
                        ctaText={card.ctaText || 'View Details'}
                    />
                ))}
            </div>

            {contact && (
                <ContactInfoBlock
                    title={contact.title || 'Department Desk & Information'}
                    phones={contact.phones || ['+91 22 2845 6000']}
                    days={contact.days || 'Monday – Saturday'}
                    timings={contact.timings || '9:00 AM – 5:00 PM'}
                    location={contact.location || 'Ground Floor, Spiritual Care Central Desk'}
                    email={contact.email}
                    note={contact.note}
                    variant="card"
                />
            )}
        </div>
    );
}

function DynamicListRenderer({ tab }) {
    const [searchTerm, setSearchTerm] = useState('');
    const items = tab.items || [];
    const contact = tab.contact;

    const filteredItems = items.filter(item =>
        (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(item.authors) ? item.authors.join(' ') : item.authors || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.journal || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div style={{ position: 'relative', maxWidth: 450, marginBottom: 12 }}>
                <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                    type="text"
                    placeholder="Search items by title, author, source..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px 14px 10px 40px',
                        borderRadius: 10,
                        border: '1px solid #CBD5E1',
                        fontFamily: "'Work Sans', sans-serif",
                        fontSize: 14,
                        outline: 'none',
                        background: '#FFFFFF',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                    }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <PublicationCard
                            key={item.id}
                            thumbnail={item.thumbnail}
                            title={item.title}
                            url={item.url}
                            authors={item.authors}
                            journal={item.journal}
                            year={item.year}
                            volume={item.volume}
                            doi={item.doi}
                            abstract={item.abstract}
                        />
                    ))
                ) : (
                    <div style={{ padding: 32, textAlign: 'center', background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                        <p style={{ color: '#64748B', margin: 0, fontSize: 14 }}>No items found matching your search.</p>
                    </div>
                )}
            </div>

            {contact && (
                <ContactInfoBlock
                    title={contact.title || 'Department Desk & Information'}
                    phones={contact.phones || ['+91 22 2845 6000']}
                    days={contact.days || 'Monday – Friday'}
                    timings={contact.timings || '9:00 AM – 5:00 PM'}
                    location={contact.location || 'Research Wing, 4th Floor, Bhaktivedanta Hospital'}
                    email={contact.email}
                    note={contact.note}
                    variant="card"
                />
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Master switch — selects appropriate renderer for normalized tab    */
/* ------------------------------------------------------------------ */
function TabContentRenderer({ tab }) {
    // If tab has nested sections, render via TabSectionsRenderer
    if (Array.isArray(tab?.sections) && tab.sections.length > 0) {
        return <TabSectionsRenderer tab={tab} />;
    }

    switch (tab.type) {
        case "spiritual_services_overview":
            return <SpiritualServicesOverviewRenderer />;
        case "spiritual_services_offered":
            return <SpiritualServicesOfferedRenderer />;
        case "spiritual_programmes":
            return <EducationalProgrammesModalRenderer />;
        case "spiritual_retreats_bimonthly":
            return <SpiritualRetreatsBiMonthlyRenderer />;
        case "spiritual_retreats_annual":
            return <SpiritualRetreatsAnnualRenderer />;
        case "spiritual_publications":
            return <PublicationsModalRenderer />;
        case "dynamic_tab_blocks":
            return <DynamicTabBlocksRenderer tab={tab} />;
        case "dynamic_card_grid":
            return <DynamicCardGridRenderer tab={tab} />;
        case "dynamic_list":
            return <DynamicListRenderer tab={tab} />;
        case "rich_text":
            return <OverviewRenderer content={tab.content} />;
        case "steps":
            return <StepsRenderer steps={tab.items || tab.steps} />;
        case "highlights":
        case "checklist":
            return <HighlightsRenderer items={tab.items} />;
        case "specialists":
        case "cards":
            return <SpecialistsRenderer items={tab.items || tab.cards} />;
        case "testimonials":
            return <TestimonialsRenderer items={tab.items || tab.testimonials} />;
        case "gallery":
            return <GalleryRenderer items={tab.items || tab.galleryImages} />;
        case "faq":
        case "faqs":
            return <FaqRenderer items={tab.items || tab.faqs} />;
        case "logo_grid":
            return <LogoGridSection logos={tab.logos || tab.items} />;
        default:
            return <OverviewRenderer content={tab.content} />;
    }
}

/* ------------------------------------------------------------------ */
/*  Normalizer: Converts raw API data shape to normalized tab modal   */
/* ------------------------------------------------------------------ */
function normalizeServiceData(rawService, defaultCatName = "Healthcare Services") {
    if (!rawService) return null;

    if (rawService.isSpiritualCare || rawService.spiritualType || rawService.category === 'Spiritual Care') {
        const type = rawService.spiritualType || rawService.layout;
        const name = rawService.name || rawService.title || 'Spiritual Care';
        const category = 'Spiritual Care';

        if (rawService.id === 'spiritual-care-services' || type === 'services') {
            return {
                category,
                name,
                tabs: [
                    { id: 'overview', label: 'Overview', type: 'spiritual_services_overview' },
                    { id: 'services-offered', label: 'Services Offered', type: 'spiritual_services_offered' }
                ]
            };
        }
        if (rawService.id === 'educational-programmes' || type === 'programmes') {
            return {
                category,
                name,
                tabs: [
                    { id: 'programmes', label: 'Educational Programmes', type: 'spiritual_programmes' }
                ]
            };
        }
        if (rawService.id === 'spiritual-retreats' || type === 'retreats') {
            return {
                category,
                name,
                tabs: [
                    { id: 'bimonthly', label: 'BI-Monthly Spiritual Retreat', type: 'spiritual_retreats_bimonthly' },
                    { id: 'annual', label: 'Annual Spiritual Retreat', type: 'spiritual_retreats_annual' }
                ]
            };
        }
        if (rawService.id === 'publications' || type === 'publications') {
            return {
                category,
                name,
                tabs: [
                    { id: 'publications', label: 'Publications & Papers', type: 'spiritual_publications' }
                ]
            };
        }

        // Generic Dynamic Section Tabs Layout
        if (rawService.layout === 'tabs' && Array.isArray(rawService.tabs) && rawService.tabs.length > 0) {
            return {
                category,
                name,
                tabs: rawService.tabs.map(t => ({
                    id: t.id || t.label,
                    label: t.label || t.title || 'Overview',
                    type: 'dynamic_tab_blocks',
                    blocks: t.blocks || [],
                    content: t.content || '',
                    overview: t.overview
                }))
            };
        }

        // Generic Dynamic Section Card-Grid Layout
        if (rawService.layout === 'card-grid') {
            return {
                category,
                name,
                tabs: [
                    {
                        id: 'cards',
                        label: rawService.title || 'Programs',
                        type: 'dynamic_card_grid',
                        cards: rawService.cards || rawService.programmes || [],
                        contact: rawService.contact
                    }
                ]
            };
        }

        // Generic Dynamic Section List Layout
        if (rawService.layout === 'list') {
            return {
                category,
                name,
                tabs: [
                    {
                        id: 'items',
                        label: rawService.title || 'Publications',
                        type: 'dynamic_list',
                        items: rawService.items || rawService.publications || [],
                        contact: rawService.contact
                    }
                ]
            };
        }

        // Generic Dynamic Section Flexible Block Layout
        if (rawService.layout === 'flexible' || (Array.isArray(rawService.blocks) && rawService.blocks.length > 0)) {
            return {
                category,
                name,
                tabs: [
                    {
                        id: 'flexible',
                        label: rawService.title || 'Overview',
                        type: 'dynamic_tab_blocks',
                        blocks: rawService.blocks || []
                    }
                ]
            };
        }
    }

    const category =
        rawService.category ||
        rawService.categoryName ||
        defaultCatName ||
        "Healthcare Services";
    const name = rawService.name || rawService.title || "Service Details";
    const rawTabs = (rawService.tabs || []).filter((t) => t.enabled !== false);

    const tabs = rawTabs.map((t) => {
        const label = t.label || t.title || "Overview";
        const sections = Array.isArray(t.sections)
            ? t.sections.filter((s) => s && s.enabled !== false)
            : [];

        // If tab contains nested sections, preserve sections and return
        if (sections.length > 0) {
            return {
                id: t.id,
                label,
                title: t.title || label,
                type: t.type || 'rich_text',
                content: t.content || '',
                sections,
                items: t.items || [],
                steps: t.steps || [],
                cards: t.cards || [],
                galleryImages: t.galleryImages || [],
                faqs: t.faqs || []
            };
        }

        let type = t.type || "";
        const titleLower = (t.title || t.label || "").toLowerCase();

        // Normalize backend tab type
        if (type === "rich_text" || type === "overview" || type === "richtext") {
            type = "rich_text";
        } else if (type === "list" || type === "bullets" || type === "points" || type === "checklist") {
            type = "highlights";
        } else if (type === "cards" || type === "doctors") {
            type = "specialists";
        } else if (type === "steps" || type === "process" || type === "workflow") {
            type = "steps";
        } else if (type === "testimonials" || type === "reviews") {
            type = "testimonials";
        } else if (type === "gallery" || type === "photos" || type === "images") {
            type = "gallery";
        } else if (type === "faq" || type === "faqs") {
            type = "faq";
        } else if (type === "logo_grid" || type === "logos" || type === "partners") {
            type = "logo_grid";
        }

        // If tab has doc content or content without items, ensure it's rich_text
        if (!type && t.content && (typeof t.content === 'object' || typeof t.content === 'string') && (!t.steps || t.steps.length === 0) && (!t.items || t.items.length === 0)) {
            type = "rich_text";
        }

        // Infer type if missing
        if (!type) {
            if (t.steps && t.steps.length > 0) {
                type = "steps";
            } else if (t.faqs && t.faqs.length > 0) {
                type = "faq";
            } else if (t.galleryImages && t.galleryImages.length > 0) {
                type = "gallery";
            } else if (t.cards && t.cards.length > 0) {
                type = "specialists";
            } else if (t.testimonials && t.testimonials.length > 0) {
                type = "testimonials";
            } else if (titleLower.includes("faq") || titleLower.includes("question")) {
                type = "faq";
            } else if (titleLower.includes("overview") || titleLower.includes("about") || titleLower.includes("facility") || titleLower.includes("service")) {
                type = "rich_text";
            } else if (titleLower.includes("how it") || titleLower.includes("step") || titleLower.includes("process") || titleLower.includes("workflow")) {
                type = "steps";
            } else if (titleLower.includes("highlight") || titleLower.includes("key point") || titleLower.includes("feature") || titleLower.includes("checklist") || titleLower.includes("right") || titleLower.includes("rule")) {
                type = "highlights";
            } else if (titleLower.includes("specialist") || titleLower.includes("doctor") || titleLower.includes("team") || titleLower.includes("card") || titleLower.includes("amenit")) {
                type = "specialists";
            } else if (titleLower.includes("testimonial") || titleLower.includes("review") || titleLower.includes("story")) {
                type = "testimonials";
            } else if (titleLower.includes("gallery") || titleLower.includes("photo") || titleLower.includes("image")) {
                type = "gallery";
            } else {
                type = "rich_text";
            }
        }

        // Normalize data based on type
        if (type === "steps") {
            const steps = (t.steps || t.items || []).map((s) => ({
                title: s.title || "",
                description: s.description || "",
                icon: s.icon || "",
            }));
            return { id: t.id, label, type, items: steps, sections: [] };
        }

        if (type === "highlights") {
            const items = (t.items || t.highlights || []).map((h) =>
                typeof h === "string" ? h : h.text || h.title || h.description || ""
            );
            return { id: t.id, label, type, items, sections: [] };
        }

        if (type === "specialists") {
            const items = (t.cards || t.items || t.specialists || []).map((c) => ({
                name: c.name || c.doctorName || c.title || "Specialist",
                title: c.title || c.name || "Specialist",
                role: c.role || c.designation || c.tag || "",
                qualification: c.qualification || c.qualifications || c.description || "",
                description: c.description || c.qualification || "",
                photo: c.photo || c.image || c.avatar || c.imageUrl || "",
                icon: c.icon || "",
            }));
            return { id: t.id, label, type, items, sections: [] };
        }

        if (type === "testimonials") {
            const items = (t.testimonials || t.items || []).map((test) => ({
                quote: test.quote || test.content || test.text || "",
                author: test.author || test.name || "Patient",
                location: test.location || test.role || "Patient",
                rating: test.rating || 5,
            }));
            return { id: t.id, label, type, items, sections: [] };
        }

        if (type === "gallery") {
            const items = (t.galleryImages || t.items || t.images || []).map((g) =>
                typeof g === "string"
                    ? { image: g, caption: "" }
                    : { image: g.image || g.url || g.imageUrl || "", caption: g.caption || g.title || "" }
            );
            return { id: t.id, label, type, items, sections: [] };
        }

        if (type === "faq") {
            const items = (t.faqs || t.items || []).map((f) => ({
                question: f.question || f.title || f.q || "",
                answer: f.answer || f.description || f.content || f.a || "",
            }));
            return { id: t.id, label, type: "faq", items, sections: [] };
        }

        if (type === "logo_grid") {
            const logos = (t.logos || t.items || []).map((l, idx) => ({
                id: l.id || `logo-${idx}`,
                name: l.name || l.title || l.company || '',
                imageUrl: l.imageUrl || l.image || l.url || l.logo || '',
                order: l.order || (idx + 1),
                enabled: l.enabled !== false
            }));
            return { id: t.id, label, type: "logo_grid", logos, items: logos, sections: [] };
        }

        // Default: rich_text
        return {
            id: t.id,
            label,
            type: "rich_text",
            content: t.content || t.items || t.description || "",
            sections: [],
        };
    });

    return {
        category,
        name,
        tabs: tabs.length > 0 ? tabs : [
            {
                label: "Overview",
                type: "rich_text",
                content: rawService.shortDescription || rawService.description || "Specialized clinical care tailored for patients.",
            },
        ],
    };
}

/* ------------------------------------------------------------------ */
/*  Fallback demo service if no prop passed                           */
/* ------------------------------------------------------------------ */
const demoService = {
    category: "Healthcare Services",
    name: "Cardiac Wellness",
    tabs: [
        {
            label: "Overview",
            type: "rich_text",
            content: [
                { type: "heading", level: 2, text: "Comprehensive care, built around you" },
                {
                    type: "paragraph",
                    text: "Our team combines advanced diagnostics with a personal approach, so every treatment plan reflects the patient in front of us — not a one-size-fits-all protocol.",
                },
                {
                    type: "bulletList",
                    items: [
                        "24/7 emergency and outpatient consultation",
                        "Advanced diagnostic infrastructure",
                        "Multidisciplinary panel of specialists",
                    ],
                },
            ],
        },
        {
            label: "How It Works",
            type: "steps",
            items: [
                {
                    title: "Initial assessment & consultation",
                    description: "Comprehensive clinical evaluation and baseline investigations.",
                },
                {
                    title: "Personalized treatment plan",
                    description: "A customized therapeutic protocol crafted by our multidisciplinary panel.",
                },
                {
                    title: "Follow-up & long-term wellness",
                    description: "Continuous monitoring, recovery tracking, and lifestyle guidance.",
                },
            ],
        },
        {
            label: "Key Highlights",
            type: "highlights",
            items: [
                "Comprehensive 24/7 emergency & outpatient consultation",
                "Advanced diagnostic infrastructure with high-precision accuracy",
                "Multidisciplinary team of experienced clinical specialists",
            ],
        },
        {
            label: "Specialists",
            type: "specialists",
            items: [
                {
                    name: "Dr. Ananya Rao",
                    role: "Senior Consultant, Cardiology",
                    qualification: "MD, DM Cardiology — 12 years of clinical experience.",
                    photo: "",
                },
            ],
        },
        {
            label: "Testimonials",
            type: "testimonials",
            items: [
                {
                    quote: "The doctors and nursing staff were exceptionally caring and attentive throughout my recovery.",
                    author: "Gayatri",
                    location: "Mumbai, Patient",
                    rating: 5,
                },
                {
                    quote: "A holistic approach to health that addressed both physical and emotional wellbeing. Truly grateful.",
                    author: "Sonali Sharma",
                    location: "Thane, Patient",
                    rating: 5,
                },
            ],
        },
        {
            label: "Photo Gallery",
            items: [
                { image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop", caption: "Consultation room" },
                { image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=800&auto=format&fit=crop", caption: "Diagnostic centre" },
                { image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop", caption: "Recovery ward" },
            ],
        },
    ],
};

/* ------------------------------------------------------------------ */
/*  Main Modal Component with Fullscreen Toggle                        */
/* ------------------------------------------------------------------ */
export default function ServiceDetailModal({
    service,
    speciality,
    categoryName,
    onClose = () => { },
}) {
    // Handle either prop name: service or speciality
    const rawData = service || speciality;
    const normalized = normalizeServiceData(rawData, categoryName) || demoService;

    const [active, setActive] = useState(
        normalized.tabs[0] ? normalized.tabs[0].label : "Overview"
    );
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Reset active tab & fullscreen whenever active service changes
    useEffect(() => {
        if (normalized?.tabs?.[0]) {
            setActive(normalized.tabs[0].label);
        }
        setIsFullscreen(false);
    }, [rawData?.id, rawData?.name]);

    // Handle escape key and body scroll locking
    useEffect(() => {
        if (rawData) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                if (isFullscreen) {
                    setIsFullscreen(false);
                } else {
                    onClose();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [rawData, isFullscreen, onClose]);

    if (!rawData) return null;

    const activeTab =
        normalized.tabs.find((t) => t.label === active) || normalized.tabs[0];

    return (
        <div
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 99999,
                background: "rgba(10, 25, 47, 0.65)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                display: "flex",
                alignItems: isFullscreen ? "stretch" : "center",
                justifyContent: "center",
                padding: isFullscreen ? 0 : "20px 16px",
                transition: "padding 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                animation: "fadeInModal 0.2s ease-out",
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600;700&display=swap');
                @keyframes fadeInModal {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>

            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: tokens.ivory,
                    borderRadius: isFullscreen ? 0 : 20,
                    width: isFullscreen ? "100vw" : "100%",
                    maxWidth: isFullscreen ? "100vw" : 920,
                    height: isFullscreen ? "100vh" : "auto",
                    maxHeight: isFullscreen ? "100vh" : "88vh",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: isFullscreen
                        ? "none"
                        : "0 25px 60px -12px rgba(15, 23, 42, 0.45)",
                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        position: "relative",
                        background: `linear-gradient(120deg, ${tokens.navy}, ${tokens.navyLight})`,
                        padding: isFullscreen ? "28px 36px" : "32px 32px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 20,
                        flexShrink: 0,
                        transition: "padding 0.2s ease",
                    }}
                >
                    <div>
                        <span
                            style={{
                                fontFamily: "'Work Sans', sans-serif",
                                fontSize: 12.5,
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                color: "#9FB4D8",
                            }}
                        >
                            {normalized.category.toUpperCase()}
                        </span>
                        <h1
                            style={{
                                fontFamily: "'Fraunces', serif",
                                fontWeight: 600,
                                fontSize: isFullscreen ? 36 : 32,
                                color: tokens.ivory,
                                margin: "6px 0 0",
                                transition: "font-size 0.2s ease",
                            }}
                        >
                            {normalized.name}
                        </h1>
                    </div>

                    {/* Action buttons (Fullscreen toggle & Close) */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <button
                            type="button"
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                            aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                            style={{
                                width: 38,
                                height: 38,
                                borderRadius: "50%",
                                border: "none",
                                background: isFullscreen
                                    ? "rgba(255,255,255,0.28)"
                                    : "rgba(255,255,255,0.15)",
                                color: tokens.ivory,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "background 0.2s ease, transform 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.3)";
                                e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = isFullscreen
                                    ? "rgba(255,255,255,0.28)"
                                    : "rgba(255,255,255,0.15)";
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >
                            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            title="Close"
                            aria-label="Close modal"
                            style={{
                                width: 38,
                                height: 38,
                                borderRadius: "50%",
                                border: "none",
                                background: "rgba(255,255,255,0.15)",
                                color: tokens.ivory,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "background 0.2s ease, transform 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                                e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Tabs navigation */}
                {normalized.tabs && normalized.tabs.length > 1 && (
                    <TabNav
                        tabs={normalized.tabs}
                        active={active}
                        onChange={setActive}
                    />
                )}

                {/* Tab content area */}
                <div
                    style={{
                        padding: isFullscreen ? "36px 48px 48px" : "30px 32px 40px",
                        overflowY: "auto",
                        flex: 1,
                        transition: "padding 0.2s ease",
                    }}
                >
                    {activeTab && <TabContentRenderer tab={activeTab} />}
                </div>
            </div>
        </div>
    );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Award, BookOpen, CalendarDays, FileText, Mic2, Video } from "lucide-react";

export type ActivityCategoryKey = "publications" | "certifications" | "eContent" | "events" | "guestTalks";

export type ActivityRecord = {
    title: string;
    description?: string;
    date?: string;
    venue?: string;
    organization?: string;
    link?: string;
    type?: string;
};

export type ActivityCategory = {
    key: ActivityCategoryKey;
    label: string;
    description?: string;
    visible: boolean;
    order: number;
    records: ActivityRecord[];
};

const iconMap = {
    publications: FileText,
    certifications: Award,
    eContent: Video,
    events: CalendarDays,
    guestTalks: Mic2,
};

const fallbackActivities: ActivityCategory[] = [
    { key: "publications", label: "Publications", visible: true, order: 0, records: [] },
    { key: "certifications", label: "Continuing Education & Certifications", visible: true, order: 1, records: [] },
    { key: "eContent", label: "E-Content Developed", visible: true, order: 2, records: [] },
    { key: "events", label: "Events Organised", visible: true, order: 3, records: [] },
    { key: "guestTalks", label: "Guest Talks", visible: true, order: 4, records: [] },
];

export default function ActivityTabs({
    activities = fallbackActivities,
    initialKey,
}: {
    activities?: ActivityCategory[];
    initialKey?: ActivityCategoryKey;
}) {
    const sourceActivities = activities.length ? activities : fallbackActivities;
    const visibleActivities = useMemo(
        () => sourceActivities.filter((activity) => activity.visible).sort((a, b) => a.order - b.order),
        [sourceActivities],
    );
    const [activeKey, setActiveKey] = useState<ActivityCategoryKey>(initialKey || visibleActivities[0]?.key || "publications");
    const activeActivity = visibleActivities.find((activity) => activity.key === activeKey) || visibleActivities[0];

    useEffect(() => {
        if (initialKey) setActiveKey(initialKey);
    }, [initialKey]);

    if (!activeActivity) return null;

    return (
        <section className="activity-tabs glass-panel">
            <div className="activity-tabs__header">
                <span className="activity-tabs__eyebrow">Academic Activities</span>
                <h3>Scholarly work beyond the classroom</h3>
            </div>

            <div className="activity-tabs__tablist" role="tablist" aria-label="Academic activity categories">
                {visibleActivities.map((activity) => {
                    const Icon = iconMap[activity.key] || BookOpen;
                    const active = activity.key === activeActivity.key;
                    return (
                        <button
                            key={activity.key}
                            role="tab"
                            type="button"
                            aria-selected={active}
                            onClick={() => setActiveKey(activity.key)}
                            className="activity-tabs__tab"
                        >
                            {active && <motion.span layoutId="activity-tab-indicator" className="activity-tabs__indicator" />}
                            <Icon size={16} />
                            <span>{activity.label}</span>
                        </button>
                    );
                })}
            </div>

            <div
                className="activity-tabs__content"
                role="tabpanel"
            >
                <div className="activity-tabs__summary">
                    <p>{activeActivity.description || "Curated records managed from the admin dashboard."}</p>
                    <strong>{activeActivity.records.length}</strong>
                </div>

                <div className="activity-tabs__records">
                    {activeActivity.records.length > 0 ? (
                        activeActivity.records.map((record, index) => (
                            <article key={`${record.title}-${index}`} className="activity-tabs__record">
                                <div>
                                    <span>{record.type || record.date || "Record"}</span>
                                    <h4>{record.title}</h4>
                                    {record.description && <p>{record.description}</p>}
                                </div>
                                <div className="activity-tabs__meta">
                                    {record.organization && <span>{record.organization}</span>}
                                    {record.venue && <span>{record.venue}</span>}
                                    {record.link && (
                                        <a href={record.link} target="_blank" rel="noreferrer">
                                            View
                                        </a>
                                    )}
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="activity-tabs__empty">No records are published for this activity yet.</div>
                    )}
                </div>
            </div>
        </section>
    );
}

"use client";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Save, Trash2, GripVertical, FileText } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Block Item Component
function SortableBlockItem({ id, index, blockType, register, removeBlock }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: isDragging ? ("relative" as const) : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative rounded-lg bg-zinc-800/30 p-4 ring-1 ring-white/5 group ${isDragging ? "opacity-50 ring-blue-500/50" : ""}`}>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-2 text-zinc-500 hover:text-white" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="flex justify-between items-center pl-8 mb-4 border-b border-white/5 pb-2">
        <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
          {blockType} BLOCK
        </span>
        <button
          type="button"
          onClick={() => removeBlock(index)}
          className="text-zinc-500 hover:text-red-400 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="pl-8">
        <label className="block text-xs font-medium text-zinc-400 mb-1">Raw JSON Data (Editable Payload)</label>
        <textarea
          {...register(`blocks.${index}.dataString` as const)}
          className="w-full rounded-lg border-0 bg-zinc-900/80 py-2 px-3 text-emerald-400 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-blue-500 sm:text-sm font-mono h-32"
          placeholder="{}"
        />
        <input type="hidden" {...register(`blocks.${index}.type` as const)} value={blockType} />
        <input type="hidden" {...register(`blocks.${index}._id` as const)} />
      </div>
    </div>
  );
}

export default function ContentEditorPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [activePageSlug, setActivePageSlug] = useState<string>("home");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      isPublished: true,
      blocks: [] as any[],
    },
  });

  const { fields: blockFields, append: appendBlock, remove: removeBlock, move: moveBlock } = useFieldArray({
    control,
    name: "blocks",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch all pages for the dropdown
  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await fetch("/api/pages");
        const data = await res.json();
        if (Array.isArray(data)) {
          setPages(data);
        }
      } catch (err) {
        console.error("Failed to load pages list", err);
      }
    }
    fetchPages();
  }, []);

  // Fetch specific page content
  useEffect(() => {
    async function fetchPageContent() {
      setLoading(true);
      try {
        const res = await fetch(`/api/pages/${activePageSlug}`);
        const data = await res.json();
        
        if (data && data.blocks) {
          // We map 'data' to a stringified 'dataString' for easy editing in MVP
          data.blocks = data.blocks.map((block: any, i: number) => ({ 
            ...block, 
            id: block._id || `block-${i}`,
            dataString: JSON.stringify(block.data, null, 2)
          }));
          reset(data);
        }
      } catch (err) {
        console.error("Failed to load page data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPageContent();
  }, [activePageSlug, reset]);

  const onSubmit = async (formData: any) => {
    setSaving(true);
    setSaveMessage("");
    
    // Convert dataString back to JSON object for the API
    try {
      const payload = {
        ...formData,
        blocks: formData.blocks.map((b: any) => ({
          type: b.type,
          data: JSON.parse(b.dataString)
        }))
      };

      const res = await fetch(`/api/pages/${activePageSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSaveMessage("Page saved successfully!");
      } else {
        setSaveMessage("Failed to save.");
      }
    } catch (err) {
      setSaveMessage("Error occurred. Invalid JSON syntax in one of the blocks.");
    }
    setSaving(false);
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blockFields.findIndex((item: any) => item.id === active.id);
      const newIndex = blockFields.findIndex((item: any) => item.id === over.id);
      moveBlock(oldIndex, newIndex);
    }
  };

  const addBlock = (type: string) => {
    appendBlock({
      id: `block-${Date.now()}`,
      type,
      dataString: "{\n  \"heading\": \"New Section\"\n}"
    });
  };

  if (loading && pages.length === 0) {
    return <div className="text-zinc-400">Loading CMS Engine...</div>;
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Page Builder CMS</h1>
          <p className="mt-2 text-sm text-zinc-400">Select a page, edit blocks, or drag-and-drop sections.</p>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-all cursor-pointer"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Page"}
        </button>
      </div>

      {saveMessage && (
        <div className={`p-4 rounded-lg ${saveMessage.includes("success") ? "bg-green-500/10 text-green-400 ring-1 ring-green-500/20" : "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"}`}>
          {saveMessage}
        </div>
      )}

      {/* Page Selector */}
      <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-xl ring-1 ring-white/5">
        <FileText className="text-zinc-400" />
        <select 
          value={activePageSlug}
          onChange={(e) => setActivePageSlug(e.target.value)}
          className="bg-zinc-800 text-white rounded-lg px-4 py-2 border-0 ring-1 ring-white/10 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {pages.map((p) => (
            <option key={p.slug} value={p.slug}>{p.title} (/{p.slug})</option>
          ))}
        </select>
        <span className="text-sm text-zinc-500">← Switch page to edit</span>
      </div>

      {loading ? (
        <div className="text-zinc-400 animate-pulse">Loading blocks...</div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-xl bg-zinc-900/50 p-6 shadow ring-1 ring-white/5">
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
              <span className="text-sm font-medium text-zinc-400">Add New Block:</span>
              {['HERO', 'TIMELINE', 'GRID', 'LIST', 'RICH_TEXT'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addBlock(type)}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white rounded-full ring-1 ring-white/10 transition-colors"
                >
                  + {type}
                </button>
              ))}
            </div>
            
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={blockFields.map((f: any) => f.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {blockFields.map((field: any, index) => (
                    <SortableBlockItem
                      key={field.id}
                      id={field.id}
                      index={index}
                      blockType={field.type}
                      register={register}
                      removeBlock={removeBlock}
                    />
                  ))}
                  {blockFields.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-xl">
                      <p className="text-sm text-zinc-500 italic">No blocks on this page yet.</p>
                      <p className="text-xs text-zinc-600 mt-1">Click a button above to add a section.</p>
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </section>
        </div>
      )}
    </div>
  );
}

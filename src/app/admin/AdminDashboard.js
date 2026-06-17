"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit, Eye, FolderKanban, ImageUp, LayoutDashboard, Plus, Save, Trash2, X } from "lucide-react";
import { contentTypes, typeLabels } from "@/lib/sections";

const emptyForm = {
  id: null,
  type: "project",
  title: "",
  description: "",
  link: "",
  location: "",
  map_embed_url: "",
  media: [],
  sort_order: 0
};

const singletonTypes = ["intro", "about", "contact"];
const repeatableContentTypes = contentTypes.filter((type) => !singletonTypes.includes(type.value));

function isSingleton(type) {
  return singletonTypes.includes(type);
}

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [password, setPassword] = useState("");
  const [filter, setFilter] = useState("all");
  const [modalMode, setModalMode] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [dbStatus, setDbStatus] = useState("Checking connection...");

  const filteredItems = useMemo(() => {
    return filter === "all" ? items : items.filter((item) => item.type === filter);
  }, [filter, items]);

  const stats = useMemo(() => {
    return contentTypes.map((type) => ({
      ...type,
      count: items.filter((item) => item.type === type.value).length
    }));
  }, [items]);

  async function loadItems() {
    try {
      const response = await fetch("/api/content", { cache: "no-store" });
      if (!response.ok) {
        setMessage("Database connection failed. Please check your configurations.");
        setDbStatus("Disconnected");
        return;
      }
      setItems(await response.json());
      const statusHeader = response.headers.get("x-database-status") || "Connected";
      setDbStatus(statusHeader);
    } catch {
      setMessage("Database connection failed. Please check your configurations.");
      setDbStatus("Disconnected");
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function openCreate(type = filter === "all" || isSingleton(filter) ? "project" : filter) {
    setForm({ ...emptyForm, type });
    setModalMode("create");
    setMessage("");
  }

  function openEdit(item) {
    setForm({
      id: item.id,
      type: item.type,
      title: item.title || "",
      description: item.description || "",
      link: item.link || "",
      location: item.location || "",
      map_embed_url: item.map_embed_url || "",
      media: item.media || [],
      sort_order: item.sort_order || 0
    });
    setModalMode("edit");
    setMessage("");
  }

  function editSingleton(type) {
    const item = items.find((entry) => entry.type === type);
    setForm({
      ...emptyForm,
      ...(item || {}),
      type,
      title: item?.title || typeLabels[type],
      description: item?.description || "",
      link: item?.link || "",
      location: item?.location || "",
      map_embed_url: item?.map_embed_url || "",
      media: item?.media || [],
      sort_order: item?.sort_order || 0
    });
    setMessage("");
  }

  function closeModal() {
    setModalMode(null);
    setDeleteTarget(null);
    setMessage("");
  }

  async function uploadFiles(files) {
    if (!files.length) return;
    setBusy(true);
    setMessage("Uploading media...");

    const data = new FormData();
    Array.from(files).forEach((file) => data.append("files", file));

    const response = await fetch("/api/upload", {
      method: "POST",
      headers: password ? { "x-admin-password": password } : {},
      body: data
    });

    if (!response.ok) {
      setMessage("Upload failed. Check the admin password.");
      setBusy(false);
      return;
    }

    const uploaded = await response.json();
    setForm((current) => ({ ...current, media: [...current.media, ...uploaded] }));
    setMessage("Media added.");
    setBusy(false);
  }

  async function saveItem(event) {
    event.preventDefault();
    setBusy(true);
    setMessage(form.id ? "Updating content..." : "Creating content...");

    const response = await fetch(form.id ? `/api/content/${form.id}` : "/api/content", {
      method: form.id ? "PUT" : "POST",
      headers: {
        "content-type": "application/json",
        ...(password ? { "x-admin-password": password } : {})
      },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      setMessage("Save failed. Check database configurations and admin password.");
      setBusy(false);
      return;
    }

    await loadItems();
    setBusy(false);
    closeModal();
  }

  async function saveSingleton(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("Saving settings...");

    const response = await fetch(form.id ? `/api/content/${form.id}` : "/api/content", {
      method: form.id ? "PUT" : "POST",
      headers: {
        "content-type": "application/json",
        ...(password ? { "x-admin-password": password } : {})
      },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      setMessage("Save failed. Check database configurations and admin password.");
      setBusy(false);
      return;
    }

    await loadItems();
    setBusy(false);
    setMessage("Settings saved.");
  }

  useEffect(() => {
    if (isSingleton(filter)) {
      editSingleton(filter);
    }
  }, [filter, items]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setBusy(true);
    setMessage("Deleting content...");

    const response = await fetch(`/api/content/${deleteTarget.id}`, {
      method: "DELETE",
      headers: password ? { "x-admin-password": password } : {}
    });

    if (!response.ok) {
      setMessage("Delete failed. Check the admin password.");
      setBusy(false);
      return;
    }

    await loadItems();
    setBusy(false);
    closeModal();
  }

  return (
    <main className="admin-shell">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-logo" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/logo.jpg" alt="BM Logo" style={{ height: "30px", width: "30px", borderRadius: "6px", objectFit: "cover" }} />
            <span>Portfolio CMS</span>
          </div>
          <nav className="admin-nav" aria-label="Admin sections">
            <button type="button" className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
              <span>
                <LayoutDashboard size={16} /> Dashboard
              </span>
              <span>{items.length}</span>
            </button>
            {stats.map((type) => (
              <button type="button" className={filter === type.value ? "active" : ""} key={type.value} onClick={() => setFilter(type.value)}>
                <span>
                  <FolderKanban size={16} /> {type.label}
                </span>
                <span>{type.count}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="admin-main">
          <header className="admin-topbar">
            <div>
              <h1>{filter === "all" ? "Dashboard" : typeLabels[filter]}</h1>
              <p>No page reloads: all admin creates, updates, uploads, and deletes run through client-side API calls.</p>
            </div>
            <div className="admin-actions">
              <input className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Admin password" aria-label="Admin password" />
              <a className="btn" href="/">
                <Eye size={17} /> Preview
              </a>
              {!isSingleton(filter) ? (
                <button className="btn primary" type="button" onClick={() => openCreate()}>
                  <Plus size={17} /> Add Content
                </button>
              ) : null}
            </div>
          </header>

          <div className="admin-content">
            {isSingleton(filter) ? (
              <form className="admin-panel admin-form" onSubmit={saveSingleton}>
                <div className="admin-toolbar">
                  <div>
                    <h2>{typeLabels[filter]} Settings</h2>
                    <p className="meta">This is one portfolio section, so it uses a direct edit form instead of create/delete modals.</p>
                  </div>
                  <button className="btn primary" type="submit" disabled={busy}>
                    <Save size={17} /> Save
                  </button>
                </div>

                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="field">
                      <span>Title</span>
                      <input className="input" value={form.title} onChange={(event) => updateField("title", event.target.value)} required />
                    </label>
                  </div>
                  <div className="col-md-4">
                    <label className="field">
                      <span>Sort order</span>
                      <input className="input" type="number" value={form.sort_order} onChange={(event) => updateField("sort_order", event.target.value)} />
                    </label>
                  </div>
                  <div className="col-12">
                    <label className="field">
                      <span>Description</span>
                      <textarea className="textarea" value={form.description} onChange={(event) => updateField("description", event.target.value)} />
                    </label>
                  </div>
                  <div className="col-md-6">
                    <label className="field">
                      <span>Link</span>
                      <input className="input" value={form.link} onChange={(event) => updateField("link", event.target.value)} placeholder="https://..." />
                    </label>
                  </div>
                  <div className="col-md-6">
                    <label className="field">
                      <span>Location</span>
                      <input className="input" value={form.location} onChange={(event) => updateField("location", event.target.value)} placeholder="City, country" />
                    </label>
                  </div>
                  <div className="col-12">
                    <label className="field">
                      <span>Map embed URL</span>
                      <input className="input" value={form.map_embed_url} onChange={(event) => updateField("map_embed_url", event.target.value)} placeholder="Google Maps embed URL" />
                    </label>
                  </div>
                  <div className="col-12">
                    <label className="field">
                      <span>Images or videos</span>
                      <input className="input" type="file" multiple accept="image/*,video/*" onChange={(event) => uploadFiles(event.target.files)} />
                    </label>
                  </div>
                  {form.media.length ? (
                    <div className="col-12">
                      <div className="media-list">
                        {form.media.map((media, index) => (
                          <button
                            className="media-chip"
                            type="button"
                            key={`${media.url}-${index}`}
                            onClick={() => updateField("media", form.media.filter((_, mediaIndex) => mediaIndex !== index))}
                          >
                            <X size={13} /> {media.name || media.url}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
                {message ? <p className="meta">{message}</p> : null}
              </form>
            ) : (
              <div className="admin-panel">
              <div className="admin-toolbar">
                <div>
                  <h2>Content List</h2>
                  <p className="meta">{filteredItems.length} records shown. Engine: <strong>{dbStatus}</strong></p>
                </div>
                <select className="select" value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter content">
                  <option value="all">All sections</option>
                  {contentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Section</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Media</th>
                      <th>Sort</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id}>
                        <td>{typeLabels[item.type]}</td>
                        <td>{item.title}</td>
                        <td className="text-truncate" style={{ maxWidth: 320 }}>
                          {item.description}
                        </td>
                        <td>{item.media?.length || 0}</td>
                        <td>{item.sort_order}</td>
                        <td>
                          <div className="card-actions justify-content-end">
                            {isSingleton(item.type) ? (
                              <button className="btn" type="button" onClick={() => setFilter(item.type)}>
                                <Edit size={16} /> Manage
                              </button>
                            ) : (
                              <>
                                <button className="btn" type="button" onClick={() => openEdit(item)}>
                                  <Edit size={16} /> Edit
                                </button>
                                <button className="btn danger" type="button" onClick={() => setDeleteTarget(item)}>
                                  <Trash2 size={16} /> Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!filteredItems.length ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          No content yet. Add your first portfolio item.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
            )}
          </div>
        </section>
      </div>

      {modalMode ? (
        <div className="modal fade show d-block bootstrap-modal" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <form className="modal-content" onSubmit={saveItem}>
              <div className="modal-header">
                <h2 className="modal-title h5">{modalMode === "create" ? "Create Content" : "Update Content"}</h2>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Section</label>
                    <select className="form-select" value={form.type} onChange={(event) => updateField("type", event.target.value)}>
                      {repeatableContentTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Sort order</label>
                    <input className="form-control" type="number" value={form.sort_order} onChange={(event) => updateField("sort_order", event.target.value)} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Title</label>
                    <input className="form-control" value={form.title} onChange={(event) => updateField("title", event.target.value)} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows="5" value={form.description} onChange={(event) => updateField("description", event.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Link</label>
                    <input className="form-control" value={form.link} onChange={(event) => updateField("link", event.target.value)} placeholder="https://..." />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Location</label>
                    <input className="form-control" value={form.location} onChange={(event) => updateField("location", event.target.value)} placeholder="City, country" />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Map embed URL</label>
                    <input className="form-control" value={form.map_embed_url} onChange={(event) => updateField("map_embed_url", event.target.value)} placeholder="Google Maps embed URL" />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Images or videos</label>
                    <input className="form-control" type="file" multiple accept="image/*,video/*" onChange={(event) => uploadFiles(event.target.files)} />
                  </div>
                  {form.media.length ? (
                    <div className="col-12">
                      <div className="media-list">
                        {form.media.map((media, index) => (
                          <button
                            className="media-chip"
                            type="button"
                            key={`${media.url}-${index}`}
                            onClick={() => updateField("media", form.media.filter((_, mediaIndex) => mediaIndex !== index))}
                            title="Remove media"
                          >
                            <X size={13} /> {media.name || media.url}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="modal-footer">
                {message ? <span className="text-muted me-auto">{message}</span> : null}
                <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success" disabled={busy}>
                  <Save size={17} /> Save
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop fade show" onClick={closeModal} />
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="modal fade show d-block bootstrap-modal" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title h5">Delete Confirmation</h2>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
              </div>
              <div className="modal-body">
                <p>
                  Delete <strong>{deleteTarget.title}</strong> from {typeLabels[deleteTarget.type]}?
                </p>
                <p className="text-muted mb-0">This removes the record from the database ({dbStatus}). Uploaded files stay in public/uploads.</p>
              </div>
              <div className="modal-footer">
                {message ? <span className="text-muted me-auto">{message}</span> : null}
                <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={busy}>
                  <Trash2 size={17} /> Delete
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={closeModal} />
        </div>
      ) : null}
    </main>
  );
}

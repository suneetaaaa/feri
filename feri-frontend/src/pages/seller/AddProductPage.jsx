import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { X, Upload, Video, AlertTriangle } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const CONDITIONS = [
  { value: 'LIKE_NEW', label: 'Like New', desc: 'Unworn or worn once. No visible wear.' },
  { value: 'EXCELLENT', label: 'Excellent', desc: 'Lightly used. Minimal signs of wear.' },
  { value: 'GOOD', label: 'Good', desc: 'Used with some signs of wear.' },
  { value: 'FAIR', label: 'Fair', desc: 'Well-used. Noticeable wear. Priced accordingly.' },
]

export default function AddProductPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [images, setImages] = useState([]) // { preview, file, uploading, url, cloudinaryId }
  const [videoFile, setVideoFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoUploading, setVideoUploading] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', condition: '', categoryId: '',
    originalPrice: '', sellingPrice: '', defectDisclosure: '',
    brand: '', size: '', color: '', tags: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.categories)).catch(() => {})
  }, [])

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.slice(0, 8 - images.length).map(file => ({
      preview: URL.createObjectURL(file),
      file, uploading: false, url: null, cloudinaryId: null
    }))
    setImages(prev => [...prev, ...newImages])
  }, [images])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': ['.jpg','.jpeg','.png','.webp'] },
    maxFiles: 8, multiple: true
  })

  const uploadImages = async () => {
    const toUpload = images.filter(i => !i.url)
    if (!toUpload.length) return images.filter(i => i.url).map(i => ({ url: i.url, cloudinaryId: i.cloudinaryId }))

    const formData = new FormData()
    toUpload.forEach(i => formData.append('images', i.file))
    setImages(prev => prev.map(i => !i.url ? {...i, uploading: true} : i))

    const { data } = await api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    const result = []
    let uploadIdx = 0
    const updated = images.map(i => {
      if (!i.url) {
        const idx = uploadIdx++
        result.push({ url: data.urls[idx], cloudinaryId: data.cloudinaryIds[idx] })
        return { ...i, url: data.urls[idx], cloudinaryId: data.cloudinaryIds[idx], uploading: false }
      }
      result.push({ url: i.url, cloudinaryId: i.cloudinaryId })
      return i
    })
    setImages(updated)
    return result
  }

  const uploadVideo = async () => {
    if (!videoFile || videoUrl) return videoUrl
    setVideoUploading(true)
    const formData = new FormData()
    formData.append('video', videoFile)
    const { data } = await api.post('/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    setVideoUrl(data.url)
    setVideoUploading(false)
    return data.url
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (images.length === 0) { toast.error('At least one photo required'); return }
    if (!form.condition) { toast.error('Please select a condition'); return }
    if (!form.defectDisclosure.trim()) { toast.error('Defect disclosure is required'); return }

    setSubmitting(true)
    try {
      const uploadedImages = await uploadImages()
      const uploadedVideo = videoFile ? await uploadVideo() : undefined

      await api.post('/products', {
        ...form,
        originalPrice: parseFloat(form.originalPrice),
        sellingPrice: parseFloat(form.sellingPrice),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        imageUrls: uploadedImages.map(i => i.url),
        cloudinaryIds: uploadedImages.map(i => i.cloudinaryId),
        videoUrl: uploadedVideo
      })

      toast.success('Product submitted for review!')
      navigate('/seller/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create listing')
    } finally {
      setSubmitting(false)
    }
  }

  const pct = form.originalPrice && form.sellingPrice
    ? Math.round(((form.originalPrice - form.sellingPrice) / form.originalPrice) * 100) : 0

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-page max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-display-sm font-semibold text-ink">List an Item</h1>
          <p className="text-muted text-sm mt-1">Be honest and detailed. Buyers trust you because of your Commitment Pledge.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Photos */}
          <div className="card p-6">
            <h2 className="font-semibold text-ink mb-1">Photos <span className="text-red-500">*</span></h2>
            <p className="text-xs text-muted mb-4">Upload up to 8 real photos. Natural lighting. No filters. This is your pledge in action.</p>

            <div className="grid grid-cols-4 gap-3 mb-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square bg-cream rounded-xl overflow-hidden">
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  {img.uploading && <div className="absolute inset-0 bg-white/70 flex items-center justify-center"><div className="w-5 h-5 border-2 border-ink/20 border-t-ink rounded-full animate-spin" /></div>}
                  {img.url && <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"><span className="text-white text-[9px]">✓</span></div>}
                  <button type="button" onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 left-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center">
                    <X size={10} className="text-white" />
                  </button>
                  {i === 0 && <span className="absolute bottom-1.5 left-1.5 bg-ink text-parchment text-[9px] px-1.5 py-0.5 rounded-full">Cover</span>}
                </div>
              ))}
              {images.length < 8 && (
                <div {...getRootProps()} className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors col-span-${images.length === 0 ? '4' : '1'} ${isDragActive ? 'border-gold bg-gold/5' : 'border-border hover:border-ink/40'}`}>
                  <input {...getInputProps()} />
                  <Upload size={images.length === 0 ? 28 : 18} className="text-muted mb-1" />
                  {images.length === 0 && <p className="text-sm text-muted text-center px-4">Drag photos here or click to upload</p>}
                </div>
              )}
            </div>
          </div>

          {/* Video (optional) */}
          <div className="card p-6">
            <h2 className="font-semibold text-ink mb-1">Product Video <span className="text-muted font-normal text-xs">(optional)</span></h2>
            <p className="text-xs text-muted mb-4">A short video builds even more buyer confidence. Max 50MB.</p>
            {videoFile ? (
              <div className="flex items-center gap-3 bg-parchment rounded-xl p-3">
                <Video size={18} className="text-gold" />
                <span className="text-sm text-ink flex-1 truncate">{videoFile.name}</span>
                {videoUrl && <span className="text-emerald-600 text-xs font-medium">Uploaded</span>}
                {videoUploading && <span className="text-xs text-muted">Uploading...</span>}
                <button type="button" onClick={() => { setVideoFile(null); setVideoUrl('') }}><X size={15} /></button>
              </div>
            ) : (
              <label className="flex items-center gap-3 border-2 border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-ink/30 transition-colors">
                <Video size={18} className="text-muted" />
                <span className="text-sm text-muted">Click to add a video</span>
                <input type="file" accept="video/*" className="sr-only" onChange={e => setVideoFile(e.target.files[0])} />
              </label>
            )}
          </div>

          {/* Details */}
          <div className="card p-6 space-y-5">
            <h2 className="font-semibold text-ink">Item Details</h2>
            <div>
              <label className="block text-sm font-medium mb-1.5">Title <span className="text-red-500">*</span></label>
              <input required value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
                placeholder="e.g. Zara Floral Midi Dress — Size S" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Description <span className="text-red-500">*</span></label>
              <textarea required rows={4} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
                placeholder="Describe the item — where you bought it, how you've used it, why you're selling it..."
                className="input-field resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Category <span className="text-red-500">*</span></label>
                <select required value={form.categoryId} onChange={e => setForm(f => ({...f, categoryId: e.target.value}))} className="input-field">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Brand</label>
                <input value={form.brand} onChange={e => setForm(f => ({...f, brand: e.target.value}))}
                  placeholder="e.g. Zara, Levi's" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Size</label>
                <input value={form.size} onChange={e => setForm(f => ({...f, size: e.target.value}))}
                  placeholder="e.g. S, M, L, W28" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Color</label>
                <input value={form.color} onChange={e => setForm(f => ({...f, color: e.target.value}))}
                  placeholder="e.g. Navy Blue" className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Tags</label>
              <input value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))}
                placeholder="dress, zara, floral, women (comma-separated)" className="input-field" />
            </div>
          </div>

          {/* Condition */}
          <div className="card p-6">
            <h2 className="font-semibold text-ink mb-4">Condition <span className="text-red-500">*</span></h2>
            <div className="grid grid-cols-2 gap-3">
              {CONDITIONS.map(c => (
                <label key={c.value} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${form.condition === c.value ? 'border-ink bg-ink/3' : 'border-border hover:border-ink/30'}`}>
                  <input type="radio" name="condition" value={c.value} className="sr-only"
                    checked={form.condition === c.value} onChange={e => setForm(f => ({...f, condition: e.target.value}))} />
                  <p className="font-semibold text-sm">{c.label}</p>
                  <p className="text-xs text-muted mt-0.5">{c.desc}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Defect Disclosure */}
          <div className="card p-6 border-2 border-amber-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={18} className="text-amber-600" />
              <h2 className="font-semibold text-ink">Defect Disclosure <span className="text-red-500">*</span></h2>
            </div>
            <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-3 mb-4 leading-relaxed">
              This is your Commitment Pledge in action. Be completely honest about any defects — stains, tears, missing buttons, fading, smells. Buyers rely on this.
            </p>
            <textarea required rows={3} value={form.defectDisclosure} onChange={e => setForm(f => ({...f, defectDisclosure: e.target.value}))}
              placeholder="e.g. 'No defects. Worn twice.' or 'Small stain on back hem, shown in photo 3. Minor pilling on sleeves.'"
              className="input-field resize-none" />
          </div>

          {/* Pricing */}
          <div className="card p-6">
            <h2 className="font-semibold text-ink mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Original Price (NPR) <span className="text-red-500">*</span></label>
                <input required type="number" min="0" value={form.originalPrice}
                  onChange={e => setForm(f => ({...f, originalPrice: e.target.value}))}
                  placeholder="8500" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Selling Price (NPR) <span className="text-red-500">*</span></label>
                <input required type="number" min="0" value={form.sellingPrice}
                  onChange={e => setForm(f => ({...f, sellingPrice: e.target.value}))}
                  placeholder="3200" className="input-field" />
              </div>
            </div>
            {pct > 0 && (
              <div className="bg-gold/10 border border-gold/30 rounded-xl p-3 text-center">
                <p className="text-sm font-medium text-gold">
                  Buyers save {pct}% · NPR {(form.originalPrice - form.sellingPrice).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full py-4 text-base">
            {submitting ? 'Submitting for review...' : 'Submit Listing for Review'}
          </button>
          <p className="text-xs text-center text-muted">Your listing will be reviewed within 24 hours before going live.</p>
        </form>
      </div>
    </div>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import { galleryImages } from '@/lib/galleryData'

export default function AdminGallery() {

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-primary hover:underline">← Admin</Link>
          <h1 className="text-3xl font-bold">Gallery</h1>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.length === 0 ? (
            <div className="col-span-full text-center p-8">No images yet</div>
          ) : (
            galleryImages.map(image => (
              <div key={image.id} className="bg-card border rounded-lg overflow-hidden">
                <div className="relative w-full h-48 bg-muted">
                  {image.url && (
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{image.title}</h3>
                  {image.category && <p className="text-sm text-muted-foreground mb-3">{image.category}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

import GalleryClient from './GalleryClient';
import { fetchGalleryPhotos } from '@/lib/gallery-public';

export default async function GalleryPage() {
  const photos = await fetchGalleryPhotos();

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">Our Portfolio</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Work We Are Proud Of</p>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <GalleryClient photos={photos} />
        </div>
      </div>

      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Full Portfolio of Projects and Referral List Available Upon Request
          </h2>
          <p className="text-lg text-gray-600 mb-8">Building places you want to be.</p>
          <a
            href="/contact"
            className="inline-block bg-[#3b7d98] hover:bg-[#2d5f75] text-white px-8 py-4 rounded-full font-semibold transition-colors"
          >
            Contact Us for Full Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
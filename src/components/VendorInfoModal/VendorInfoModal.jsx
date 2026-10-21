import React, { useState, useEffect } from 'react';

const naira = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 });

// CRITICAL FIX: Ensure each vendor gets their own unique storage key based on their ID
function getStorageKey(vendorId) {
  return `kk_vendor_reviews_${vendorId || 'unknown_vendor'}`;
}

const RANDOM_NAMES = [
  'Adebayo T.', 'Chidi O.', 'Zainab B.', 'Folake A.', 
  'Emeka N.', 'Blessing E.', 'Ibrahim K.', 'Tunde S.', 'Nkechi W.'
];

export default function VendorInfoModal({ vendor, isOpen, onClose }) {
  if (!isOpen || !vendor) return null;

  const vendorDishes = vendor.menu || [];

  // Load reviews specific to THIS vendor from localStorage
  const [reviewsList, setReviewsList] = useState(() => {
    try {
      const saved = localStorage.getItem(getStorageKey(vendor.id));
      if (saved) return JSON.parse(saved);
    } catch {}
    
    // Vendor-specific default fallback reviews if none are saved yet
    return vendor.reviews || [
      {
        id: `${vendor.id}-r1`,
        author: 'Oluwaseun M.',
        date: '2 days ago',
        rating: 5,
        dishName: vendorDishes[0]?.name || 'Special Meal',
        text: `Everything from ${vendor.name} was fresh, hot, and properly packaged!`,
      }
    ];
  });

  const [newAuthor, setNewAuthor] = useState('');
  const [newText, setNewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [selectedDish, setSelectedDish] = useState(vendorDishes[0]?.name || 'General Meal');
  const [showForm, setShowForm] = useState(false);

  // Save reviews under THIS vendor's unique key whenever it changes
  useEffect(() => {
    try {
      if (vendor?.id) {
        localStorage.setItem(getStorageKey(vendor.id), JSON.stringify(reviewsList));
      }
    } catch {}
  }, [reviewsList, vendor?.id]);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const authorName = newAuthor.trim() 
      ? newAuthor.trim() 
      : RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];

    const newReviewItem = {
      id: Date.now().toString(),
      author: authorName,
      date: 'Just now',
      rating: Number(newRating),
      dishName: selectedDish,
      text: newText.trim(),
    };

    setReviewsList((prev) => [newReviewItem, ...prev]);
    setNewAuthor('');
    setNewText('');
    setNewRating(5);
    setShowForm(false);
  };

  return (
    <div className="fixed inset-0 z-[9995] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-[#CBD1D6] overflow-hidden flex flex-col max-h-[85vh] shadow-2xl">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#CBD1D6]">
          <h2 className="font-heading font-bold text-lg text-[#111618]">
            About {vendor.name}
          </h2>
          <button 
            type="button" 
            onClick={onClose}
            className="text-[#4B555D] hover:text-[#111618] font-bold text-sm cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Scrollable body content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          
          {/* Kitchen Details Summary */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading font-bold text-sm text-[#111618] uppercase tracking-wider">
              Kitchen Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4 bg-[#FAFAFA] p-4 rounded-xl border border-[#CBD1D6]">
              <div>
                <p className="text-xs text-[#4B555D]">Location Area</p>
                <p className="text-sm font-semibold text-[#111618]">{vendor.area || 'Ilorin'}</p>
              </div>
              <div>
                <p className="text-xs text-[#4B555D]">Estimated Prep Time</p>
                <p className="text-sm font-semibold text-[#111618]">{vendor.etaMin || 25}–{vendor.etaMax || 40} mins</p>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="flex flex-col gap-4 pt-4 border-t border-[#CBD1D6]">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-[#111618] uppercase tracking-wider">
                Dish Reviews ({reviewsList.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="text-xs font-bold text-[#CF3A0E] hover:underline bg-transparent border-none cursor-pointer"
              >
                {showForm ? 'Cancel review' : '+ Review a dish'}
              </button>
            </div>

            {/* Interactive Review Form */}
            {showForm && (
              <form onSubmit={handleAddReview} className="flex flex-col gap-3 p-4 bg-[#FAFAFA] rounded-xl border border-[#CBD1D6]">
                <h4 className="font-heading font-bold text-xs text-[#111618] uppercase">Review a specific food</h4>
                
                <input
                  type="text"
                  placeholder="Your name (optional, random name used if blank)"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="h-10 rounded-lg border border-[#CBD1D6] bg-white px-3 text-sm text-[#111618] outline-none focus:border-[#CF3A0E]"
                />

                {/* Food Selector */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[#4B555D]">What did you order?</label>
                  <select
                    value={selectedDish}
                    onChange={(e) => setSelectedDish(e.target.value)}
                    className="h-10 rounded-lg border border-[#CBD1D6] bg-white px-3 text-sm text-[#111618] outline-none"
                  >
                    <option value="General Kitchen Order">General Kitchen Order</option>
                    {vendorDishes.map((dish) => (
                      <option key={dish.id} value={dish.name}>{dish.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#4B555D]">Rating:</span>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                    className="h-9 rounded-lg border border-[#CBD1D6] bg-white px-2 text-sm text-[#111618] outline-none"
                  >
                    <option value="5">★★★★★ (5 Stars)</option>
                    <option value="4">★★★★☆ (4 Stars)</option>
                    <option value="3">★★★☆☆ (3 Stars)</option>
                    <option value="2">★★☆☆☆ (2 Stars)</option>
                    <option value="1">★☆☆☆☆ (1 Star)</option>
                  </select>
                </div>

                <textarea
                  placeholder="How was this specific food?..."
                  rows={2}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="rounded-lg border border-[#CBD1D6] bg-white p-3 text-sm text-[#111618] outline-none resize-none focus:border-[#CF3A0E]"
                  required
                />

                <button
                  type="submit"
                  className="h-10 rounded-lg bg-[#CF3A0E] text-white text-xs font-bold cursor-pointer hover:bg-[#A82E0B]"
                >
                  Post Food Review
                </button>
              </form>
            )}

            {/* Display Reviews */}
            <div className="flex flex-col gap-3">
              {reviewsList.length === 0 ? (
                <p className="text-sm text-[#4B555D] italic">No reviews for these dishes yet.</p>
              ) : (
                reviewsList.map((review) => (
                  <div key={review.id} className="flex flex-col gap-1.5 p-3 rounded-xl border border-[#CBD1D6] bg-white">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-sm text-[#111618]">{review.author}</span>
                      <span className="text-xs text-[#4B555D]">{review.date}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold bg-[#FAFAFA] text-[#243628] px-2 py-0.5 rounded border border-[#CBD1D6]">
                        Ordered: {review.dishName || 'General Meal'}
                      </span>
                      <div className="text-xs font-bold text-[#CF3A0E]">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>

                    <p className="text-sm text-[#4B555D] mt-1">
                      {review.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
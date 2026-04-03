import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../context/LanguageContext';
import Recommendation from '../components/Recommendation';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const fallbackCities = [
  { name: 'Dhaka', lat: 23.8103, lng: 90.4125 },
  { name: 'Chattogram', lat: 22.3569, lng: 91.7832 },
  { name: 'Khulna', lat: 22.8456, lng: 89.5403 },
  { name: 'Sylhet', lat: 24.8949, lng: 91.8687 },
  { name: 'Rajshahi', lat: 24.3745, lng: 88.6042 },
];

const getShortDescription = (text = '') => {
  if (text.length <= 78) return text;
  return `${text.slice(0, 78).trim()}...`;
};

const getDistance = (lat1, lng1, lat2, lng2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
};

const Bangladesh = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [userPreferences, setUserPreferences] = useState(null);
  const { t } = useLanguage();
  const currentUserId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const sortedSelectedReviews = [...(selectedSpot?.reviews || [])].sort(
    (a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)
  );
  const existingUserReview = sortedSelectedReviews.find(
    (review) => String(review.user) === String(currentUserId)
  );

  const upsertSelectedSpotReview = (incomingReview) => {
    if (!incomingReview) return;

    setSelectedSpot((prev) => {
      if (!prev) return prev;

      const reviews = Array.isArray(prev.reviews) ? [...prev.reviews] : [];
      const existingIndex = reviews.findIndex(
        (review) => String(review.user) === String(incomingReview.user)
      );

      if (existingIndex >= 0) {
        reviews[existingIndex] = { ...reviews[existingIndex], ...incomingReview };
      } else {
        reviews.unshift(incomingReview);
      }

      return { ...prev, reviews };
    });
  };

  const fetchSpots = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/spots');
      const data = await res.json();
      setPlaces(data);
    } catch (err) {
      console.error('Error fetching spots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpots();
  }, []);

  useEffect(() => {
    if (existingUserReview) {
      setRating(Number(existingUserReview.rating) || 5);
      setComment(existingUserReview.comment || '');
      return;
    }

    setRating(5);
    setComment('');
  }, [existingUserReview, selectedSpot?._id]);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!token) return;

      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setUserPreferences({
            budgetPreference: data.budgetPreference,
            tripDurationPreference: data.tripDurationPreference,
            interests: data.interests,
          });
        }
      } catch (err) {
        console.error('Failed to load user preferences:', err);
      }
    };

    fetchPreferences();
  }, [token]);

  const syncSelectedSpot = async (spotId) => {
    if (!spotId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/spots/${spotId}`);
      if (!response.ok) return;
      const latestSpot = await response.json();
      setSelectedSpot(latestSpot);
    } catch (err) {
      console.error('Error syncing selected spot:', err);
    }
  };

  const openDynamicRouteMap = (spot) => {
    const destination = `${spot.name}, ${spot.location}, Bangladesh`;
    const nearestCity = fallbackCities.reduce((closest, city) => {
      if (!closest) return city;
      const currentDistance = getDistance(spot.lat, spot.lng, city.lat, city.lng);
      const closestDistance = getDistance(spot.lat, spot.lng, closest.lat, closest.lng);
      return currentDistance < closestDistance ? city : closest;
    }, null);

    const openGoogleDirections = (origin) => {
      const params = new URLSearchParams({
        api: '1',
        destination,
        travelmode: 'driving',
      });

      if (origin) {
        params.set('origin', origin);
      }

      window.open(`https://www.google.com/maps/dir/?${params.toString()}`, '_blank');
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => openGoogleDirections(`${coords.latitude},${coords.longitude}`),
        () => openGoogleDirections(nearestCity ? nearestCity.name : 'Dhaka'),
        { enableHighAccuracy: true, timeout: 8000 }
      );
      return;
    }

    openGoogleDirections(nearestCity ? nearestCity.name : 'Dhaka');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setReviewError('');
    setReviewSuccess('');

    if (!token) {
      setReviewError('Please login first to share your experience.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          spotId: selectedSpot?._id,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        upsertSelectedSpotReview(data.newReview);
        setComment('');
        setReviewSuccess(data.message || 'Review submitted successfully.');
        fetchSpots();
      } else {
        setReviewError(data.message || 'Review submit failed.');
        syncSelectedSpot(selectedSpot?._id);
      }
    } catch (err) {
      setReviewError('Could not connect to the server.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f8fb]">
        <div className="text-2xl font-extrabold text-[#12233c]">
          {t('spotsLoading')}
        </div>
      </div>
    );
  }

  const categories = [
    { key: 'All', label: t('categoryAll') },
    { key: 'Natural', label: t('categoryNatural') },
    { key: 'Historical', label: t('categoryHistorical') },
    { key: 'Popular', label: t('categoryPopular') },
  ];
  const filteredPlaces =
    activeCategory === 'All'
      ? places
      : places.filter((place) => (place.category || 'Popular') === activeCategory);

  return (
    <div className="min-h-screen bg-[#f7f8fb] pt-[112px] pb-20 font-sans">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center pt-10 pb-16">
          <h1 className="text-[52px] md:text-[64px] font-black text-[#12233c] tracking-[-0.04em] leading-none">
            {t('spotsHeroTitle')} <span className="text-[#1dd7a7]">{t('spotsHeroSuffix')}</span>
          </h1>
          <p className="max-w-[690px] mx-auto mt-5 text-[17px] md:text-[18px] text-[#66748a] leading-[1.7] font-semibold">
            {t('spotsHeroSubtitle')}
          </p>
          <div className="w-[100px] h-[7px] bg-[#1dd7a7] rounded-full mx-auto mt-8" />
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {categories.map((category) => (
              <button
                key={category.key}
                type="button"
                onClick={() => setActiveCategory(category.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-black border transition-colors ${
                  activeCategory === category.key
                    ? 'bg-[#12233c] text-white border-[#12233c]'
                    : 'bg-white text-[#12233c] border-[#dbe3ef] hover:border-[#12233c]'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <Recommendation initialPreferences={userPreferences || {}} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredPlaces.map((place) => (
            <div
              key={place._id}
              className="bg-white rounded-[30px] overflow-hidden border border-[#edf1f7] shadow-[0_18px_48px_rgba(15,23,42,0.08)]"
            >
              <div className="relative h-[258px]">
                <img src={place.mainImage} alt={place.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f37]/80 via-transparent to-transparent" />
                <div className="absolute top-5 left-5 bg-[#12233c]/90 text-white rounded-full px-4 py-2 text-[12px] font-black uppercase tracking-wide">
                  {place.category || 'Popular'}
                </div>
                <div className="absolute top-5 right-5 bg-white rounded-full px-5 py-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.12)] flex items-center gap-2 text-[14px] font-black text-[#12233c]">
                  <span className="text-pink-500 text-[13px]">📍</span>
                  <span>{place.location}</span>
                </div>
                <h3 className="absolute bottom-5 left-5 text-white text-[26px] font-black tracking-tight">
                  {place.name}
                </h3>
              </div>

              <div className="px-6 pt-6 pb-5">
                <p className="text-[#516174] text-[15px] leading-8 min-h-[92px] font-semibold">
                  {getShortDescription(place.description)}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-8">
                  <button
                    onClick={() => {
                      setSelectedSpot(place);
                      setComment('');
                      setRating(5);
                      setReviewError('');
                      setReviewSuccess('');
                    }}
                    className="bg-[#12233c] text-white rounded-[16px] py-[15px] text-[16px] font-extrabold shadow-sm hover:bg-[#0d1a30] transition-colors"
                  >
                    {t('viewDetails')}
                  </button>
                  <button
                    onClick={() => openDynamicRouteMap(place)}
                    className="bg-[#f3fff9] text-[#12a97f] border border-[#c8f4e7] rounded-[16px] py-[15px] text-[16px] font-extrabold hover:bg-[#e8fff6] transition-colors"
                  >
                    {t('routeMap')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedSpot && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-[860px] max-h-[92vh] overflow-y-auto bg-white rounded-[24px] border border-[#e6ecf3] shadow-[0_30px_100px_rgba(15,23,42,0.35)] p-5 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-4 items-start">
              <div className="space-y-4">
                <div className="bg-white border border-[#eef2f7] rounded-[18px] px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#f8fafc] flex items-center justify-center text-xl">🕒</div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-[#a0aec0]">{t('bestTime')}</p>
                      <p className="text-[18px] font-black text-[#1e293b] mt-1">
                        {selectedSpot.bestVisitingTime || 'Anytime'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#eef2f7] rounded-[18px] px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#f8fafc] flex items-center justify-center text-xl">💰</div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-[#a0aec0]">{t('budget')}</p>
                      <p className="text-[18px] font-black text-[#1e293b] mt-1">
                        {selectedSpot.estimatedBudget || '300 BDT'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#eef2f7] rounded-[18px] px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#f8fafc] flex items-center justify-center text-xl">🏨</div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-[#a0aec0]">{t('nearbyHotels')}</p>
                      <p className="text-[18px] font-black text-[#1e293b] mt-1">{selectedSpot.nearbyHotels}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#fff8f8] border border-[#ffdede] rounded-[18px] px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-xl">🛡️</div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-[#d94841]">{t('safetyNotice')}</p>
                      <p className="text-[18px] font-black text-[#cf3f3f] mt-1">{selectedSpot.safetyTips}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[18px] overflow-hidden border border-[#e8edf5] h-[272px]">
                <MapContainer
                  center={[selectedSpot.lat, selectedSpot.lng]}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[selectedSpot.lat, selectedSpot.lng]}>
                    <Popup>{selectedSpot.name}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-[18px] md:text-[20px] font-black text-[#12233c] mb-5">
                {t('reviewsTitle')}
              </h3>

              <div className="space-y-4 mb-5">
                {sortedSelectedReviews.length > 0 ? (
                  sortedSelectedReviews.map((rev) => (
                    <div
                      key={rev._id || `${rev.user}-${rev.createdAt}`}
                      className="border border-[#eef2f7] rounded-2xl px-4 py-4 bg-[#fafcff]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-[#12233c] text-white text-xs font-black flex items-center justify-center">
                            {rev.userName?.charAt(0) || 'G'}
                          </div>
                          <p className="font-black text-[#12233c]">{rev.userName}</p>
                        </div>
                        <p className="text-[#fbbf24] text-sm">
                          {'★'.repeat(rev.rating)}
                          {'☆'.repeat(5 - rev.rating)}
                        </p>
                      </div>
                      <p className="text-[#64748b] text-sm">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="border border-dashed border-[#d9e2ef] rounded-2xl px-5 py-5 text-[#64748b] text-sm">
                    {t('noReviews')}
                  </div>
                )}
              </div>

              <form onSubmit={handleReviewSubmit} className="border border-[#e6ecf3] rounded-2xl p-4 md:p-5 bg-white shadow-sm">
                {reviewSuccess && (
                  <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                    {reviewSuccess}
                  </div>
                )}
                {reviewError && (
                  <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                    {reviewError}
                  </div>
                )}
                {existingUserReview && (
                  <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700">
                    {t('alreadyReviewedSpot')}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                  <label className="text-[15px] font-black text-[#12233c]">{t('reviewExperience')}</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full sm:w-[170px] border border-[#dbe3ef] rounded-xl px-3 py-2 text-sm font-semibold text-[#1e293b] outline-none"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={3}>3 - Good</option>
                    <option value={2}>2 - Fair</option>
                    <option value={1}>1 - Poor</option>
                  </select>
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="It's recommended"
                  required
                  rows="4"
                  className="w-full border border-[#dbe3ef] rounded-xl px-4 py-3 text-sm text-[#334155] outline-none resize-none"
                />

                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="px-7 py-3 rounded-xl bg-[#18d6a5] text-[#0f213c] font-extrabold text-sm hover:bg-[#13c79a]"
                  >
                    {existingUserReview ? t('updateReview') : t('submitReview')}
                  </button>
                </div>
              </form>
            </div>

            <div className="border-t border-[#eef2f7] mt-6 pt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedSpot(null)}
                className="px-8 py-3 rounded-xl bg-[#f1f5f9] text-[#475569] font-extrabold text-sm hover:bg-[#e2e8f0]"
              >
                {t('close')}
              </button>
              <button
                type="button"
                onClick={() => openDynamicRouteMap(selectedSpot)}
                className="px-8 py-3 rounded-xl bg-[#18d6a5] text-[#0f213c] font-extrabold text-sm hover:bg-[#14c79a]"
              >
                🗺 {t('getDirections')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bangladesh;

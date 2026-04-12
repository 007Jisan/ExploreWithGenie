import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReviewSection from '../components/ReviewSection';
import MapComponent from '../components/MapComponent';
import { useLanguage } from '../context/LanguageContext';

const SpotDetails = () => {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('userId');
  const { t } = useLanguage();
  const [spot, setSpot] = useState(null);
  const [packages, setPackages] = useState([]);
  const [inquiryDrafts, setInquiryDrafts] = useState({});
  const [agencyReviewDrafts, setAgencyReviewDrafts] = useState({});
  const [agencyRatings, setAgencyRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const sortedReviews = [...(spot?.reviews || [])].sort(
    (a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)
  );

  useEffect(() => {
    const fetchSpotData = async () => {
      try {
        const spotRes = await fetch(`http://localhost:5000/api/spots/${id}`);
        const spotData = await spotRes.json();

        if (!spotRes.ok) {
          setSpot(null);
          return;
        }

        setSpot(spotData);

        if (token) {
          await fetch('http://localhost:5000/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ searchHistory: spotData.name }),
          });
        }

        const packageRes = await fetch(
          `http://localhost:5000/api/agency/public-packages?location=${encodeURIComponent(
            spotData.location
          )}`
        );
        const packageData = await packageRes.json();
        if (packageRes.ok) {
          setPackages(packageData);
        }
      } catch (err) {
        console.error('Error fetching spot details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotData();
  }, [id, token]);

  const handleInquiry = async (packageId) => {
    const inquiryMessage = inquiryDrafts[packageId] || '';
    setStatusMessage('');
    setErrorMessage('');

    if (!token) {
      setErrorMessage(t('pleaseLoginReview'));
      return;
    }

    if (!inquiryMessage.trim()) {
      setErrorMessage('Please write a message for the agency.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/agency/public-inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ packageId, message: inquiryMessage }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage(data.message);
        setInquiryDrafts((prev) => ({ ...prev, [packageId]: '' }));
      } else {
        setErrorMessage(data.message || 'Failed to send inquiry.');
      }
    } catch (err) {
      setErrorMessage('Failed to send inquiry.');
    }
  };

  const handleAgencyReview = async (agencyId) => {
    const rating = agencyRatings[agencyId] || 5;
    const comment = agencyReviewDrafts[agencyId] || '';
    setStatusMessage('');
    setErrorMessage('');

    if (!token) {
      setErrorMessage(t('pleaseLoginReview'));
      return;
    }

    if (!comment.trim()) {
      setErrorMessage('Please write your agency review first.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/agency/public-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ agencyId, rating, comment }),
      });
      const data = await res.json();

      if (res.ok) {
        setPackages((prev) =>
          prev.map((pkg) =>
            pkg.agency?._id === agencyId
              ? {
                  ...pkg,
                  agency: {
                    ...pkg.agency,
                    agencyReviews: [data.newReview, ...(pkg.agency?.agencyReviews || [])],
                  },
                }
              : pkg
          )
        );
        setAgencyReviewDrafts((prev) => ({ ...prev, [agencyId]: '' }));
        setAgencyRatings((prev) => ({ ...prev, [agencyId]: 5 }));
        setStatusMessage(data.message || t('agencyReviewSubmitted'));
      } else {
        setErrorMessage(data.message || 'Failed to submit agency review.');
      }
    } catch (err) {
      setErrorMessage('Failed to submit agency review.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#00df9a] mb-4 shadow-xl" />
          <p className="text-[#0a192f] font-black uppercase text-[10px] tracking-[0.4em]">
            {t('invokingGenie')}
          </p>
        </div>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="min-h-screen flex items-center justify-center text-rose-500 font-black tracking-tighter text-2xl">
        Spot not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-24 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <Link
            to="/country/bangladesh"
            className="group inline-flex items-center gap-2 text-[#0a192f] font-black text-[10px] uppercase tracking-widest hover:text-[#00df9a] transition-all"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">
              {'\u2190'}
            </span>
            {t('backToDestinations')}
          </Link>
          <div className="bg-white text-amber-500 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-amber-100 shadow-sm">
            {t('earnPointsPerReview')}
          </div>
        </div>

        {statusMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
            {statusMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
            {errorMessage}
          </div>
        )}

        <div className="bg-white rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-50 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-[450px] lg:h-auto">
              <img src={spot.mainImage} alt={spot.name} className="w-full h-full object-cover" />
              <div className="absolute top-8 left-8">
                <span className="bg-[#0a192f]/90 backdrop-blur-md text-[#00df9a] px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl">
                  {spot.location}
                </span>
              </div>
            </div>

            <div className="p-12 md:p-16 lg:p-24 flex flex-col justify-center">
              <h1 className="text-6xl md:text-7xl font-black text-[#0a192f] mb-8 tracking-tighter leading-[0.9]">
                {spot.name}
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed mb-12 font-medium">
                {spot.description}
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    {t('budget')}
                  </p>
                  <p className="text-[#0a192f] font-black text-xl leading-none">
                    {spot.estimatedBudget}
                  </p>
                </div>
                <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    {t('bestTime')}
                  </p>
                  <p className="text-[#0a192f] font-black text-xl leading-none">
                    {spot.bestVisitingTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-[#0a192f] p-10 rounded-[4rem] shadow-2xl relative overflow-hidden group">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-white font-black text-xl tracking-tight">
                  {t('interactiveRouteMap')}
                </h3>
              </div>
              <div className="h-[500px] rounded-[3rem] overflow-hidden shadow-inner ring-8 ring-white/5">
                <MapComponent lat={spot.lat} lng={spot.lng} destinationLabel={spot.name} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl mb-6">
                  {'\ud83c\udfe8'}
                </div>
                <h4 className="text-[#0a192f] font-black text-xs uppercase tracking-[0.2em] mb-4">
                  {t('nearbyHotels')}
                </h4>
                <p className="text-slate-400 text-sm font-bold leading-relaxed">
                  {spot.nearbyHotels}
                </p>
              </div>
              <div className="bg-rose-50/30 p-10 rounded-[3rem] border border-rose-100 shadow-sm">
                <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-2xl mb-6">
                  {'\ud83d\udee1\ufe0f'}
                </div>
                <h4 className="text-rose-600 font-black text-xs uppercase tracking-[0.2em] mb-4">
                  {t('safetyProtocols')}
                </h4>
                <p className="text-rose-900/70 text-sm font-bold leading-relaxed">
                  {spot.safetyTips}
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-[#0a192f]">{t('agencyPackages')}</h3>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {packages.length} {t('availableCount')}
                </span>
              </div>

              {packages.length > 0 ? (
                <div className="space-y-6">
                  {packages.map((pkg) => {
                    const agencyReviews = [...(pkg.agency?.agencyReviews || [])].sort(
                      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                    );
                    const existingAgencyReview = agencyReviews.find(
                      (review) => String(review.user) === String(currentUserId)
                    );
                    const averageRating =
                      agencyReviews.length > 0
                        ? (
                            agencyReviews.reduce(
                              (sum, review) => sum + Number(review.rating || 0),
                              0
                            ) / agencyReviews.length
                          ).toFixed(1)
                        : null;

                    return (
                      <div
                        key={pkg._id}
                        className="border border-slate-100 rounded-2xl p-5 bg-slate-50"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
                          <div>
                            <h4 className="text-lg font-black text-[#0a192f]">{pkg.title}</h4>
                            <p className="text-sm text-slate-500">
                              {pkg.location} {'\u2022'} {pkg.duration} {'\u2022'} {t('hostedBy')}{' '}
                              {pkg.agency?.name || 'Agency'}
                            </p>
                            {averageRating && (
                              <p className="text-sm text-amber-500 font-bold mt-2">
                                {averageRating}/5 ({agencyReviews.length} reviews)
                              </p>
                            )}
                          </div>
                          <p className="text-xl font-black text-[#00a36c]">BDT {pkg.price}</p>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">{pkg.description}</p>
                        <p className="text-sm text-slate-500 mb-4">
                          {t('hotelPricing')}:{' '}
                          {pkg.hotelPricing || 'Contact agency for hotel details.'}
                        </p>

                        <textarea
                          value={inquiryDrafts[pkg._id] || ''}
                          onChange={(e) =>
                            setInquiryDrafts((prev) => ({ ...prev, [pkg._id]: e.target.value }))
                          }
                          placeholder={t('askAgency')}
                          className="w-full p-3 rounded-xl border border-slate-200 mb-3 resize-none"
                          rows="3"
                        />
                        <button
                          onClick={() => handleInquiry(pkg._id)}
                          className="bg-[#0a192f] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#112240] transition-colors"
                        >
                          {t('sendInquiry')}
                        </button>

                        <div className="mt-6 border-t border-slate-200 pt-5">
                          <h5 className="text-lg font-black text-[#0a192f] mb-4">
                            {t('agencyReviewTitle')}
                          </h5>

                          <div className="space-y-3 mb-4">
                            {agencyReviews.length > 0 ? (
                              agencyReviews.slice(0, 3).map((review) => (
                                <div
                                  key={review._id || `${review.user}-${review.createdAt}`}
                                  className="bg-white rounded-xl p-4 border border-slate-200"
                                >
                                  <div className="flex items-center justify-between">
                                    <p className="font-black text-[#0a192f]">
                                      {review.userName}
                                    </p>
                                    <p className="text-amber-500 text-sm">
                                      {'\u2605'.repeat(review.rating)}
                                      {'\u2606'.repeat(5 - review.rating)}
                                    </p>
                                  </div>
                                  <p className="text-sm text-slate-600 mt-2">{review.comment}</p>
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-slate-500">{t('noReviews')}</div>
                            )}
                          </div>

                          {existingAgencyReview ? (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                              You already submitted a review for this agency.
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <label className="block text-sm font-black text-[#0a192f]">
                                {t('reviewThisAgency')}
                              </label>
                              <select
                                value={agencyRatings[pkg.agency?._id] || 5}
                                onChange={(e) =>
                                  setAgencyRatings((prev) => ({
                                    ...prev,
                                    [pkg.agency?._id]: Number(e.target.value),
                                  }))
                                }
                                className="w-full md:w-[180px] border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold"
                              >
                                <option value={5}>5 - Excellent</option>
                                <option value={4}>4 - Very Good</option>
                                <option value={3}>3 - Good</option>
                                <option value={2}>2 - Fair</option>
                                <option value={1}>1 - Poor</option>
                              </select>
                              <textarea
                                value={agencyReviewDrafts[pkg.agency?._id] || ''}
                                onChange={(e) =>
                                  setAgencyReviewDrafts((prev) => ({
                                    ...prev,
                                    [pkg.agency?._id]: e.target.value,
                                  }))
                                }
                                placeholder={t('agencyReviewPlaceholder')}
                                className="w-full p-3 rounded-xl border border-slate-200 resize-none"
                                rows="3"
                              />
                              <button
                                onClick={() => handleAgencyReview(pkg.agency?._id)}
                                className="bg-[#00df9a] text-[#0a192f] px-5 py-3 rounded-xl font-bold"
                              >
                                {t('submitAgencyReview')}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">{t('noAgencyPackages')}</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 sticky top-28">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-[#0a192f] tracking-tighter">
                {t('feedback')}
              </h3>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Module 2
              </span>
            </div>
            <ReviewSection
              spotId={spot._id}
              existingReviews={sortedReviews}
              onReviewCreated={(review) =>
                setSpot((prev) => {
                  if (!prev) return prev;

                  const reviews = Array.isArray(prev.reviews) ? [...prev.reviews] : [];
                  const existingIndex = reviews.findIndex(
                    (item) => String(item.user) === String(review.user)
                  );

                  if (existingIndex >= 0) {
                    reviews[existingIndex] = { ...reviews[existingIndex], ...review };
                  } else {
                    reviews.unshift(review);
                  }

                  return {
                    ...prev,
                    reviews,
                  };
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotDetails;

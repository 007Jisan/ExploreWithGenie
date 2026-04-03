const Booking = require('../models/Booking');

// ১. ইউজার প্যাকেজ বুক করবে
exports.createBooking = async (req, res) => {
  try {
    const { packageId, agencyId } = req.body;
    const newBooking = new Booking({
      user: req.user.id,
      package: packageId,
      agency: agencyId
    });
    await newBooking.save();
    res.status(201).json({ message: '🎉 Booking request sent to the agency successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error while booking' });
  }
};

// ২. ইউজারের নিজের বুকিং দেখার জন্য (প্রোফাইলের জন্য)
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('package', 'title price')
      .populate('agency', 'name');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ৩. এজেন্সির বুকিং রিকোয়েস্ট দেখার জন্য (ড্যাশবোর্ডের জন্য)
exports.getAgencyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ agency: req.user.id })
      .populate('package', 'title')
      .populate('user', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ৪. এজেন্সি বুকিং একসেপ্ট/রিজেক্ট করবে
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, agency: req.user.id },
      { status },
      { new: true }
    );
    res.json({ message: `Booking ${status}! ✅`, booking });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
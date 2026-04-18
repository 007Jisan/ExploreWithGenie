const Booking = require('../models/Booking');
const Package = require('../models/Package');
const User = require('../models/User');

exports.createBooking = async (req, res) => {
  try {
    const { packageId } = req.body;

    if (!packageId) {
      return res.status(400).json({ message: 'Package is required for booking.' });
    }

    if (req.user.role !== 'tourist') {
      return res.status(403).json({ message: 'Only tourists can create bookings.' });
    }

    const selectedPackage = await Package.findById(packageId)
      .populate('agency', 'name email')
      .populate('agencyId', 'name email');

    if (!selectedPackage) {
      return res.status(404).json({ message: 'Package not found.' });
    }

    const agency = selectedPackage.agency || selectedPackage.agencyId;
    if (!agency?._id) {
      return res.status(400).json({ message: 'This package is not linked to an agency yet.' });
    }

    const tourist = await User.findById(req.user.id).select('name email role');
    if (!tourist || tourist.role !== 'tourist') {
      return res.status(404).json({ message: 'Tourist account not found.' });
    }

    const existingBooking = await Booking.findOne({
      user: tourist._id,
      package: selectedPackage._id,
      status: { $in: ['Pending', 'Approved'] },
    });

    if (existingBooking) {
      return res.status(400).json({
        message: 'You already have an active booking request for this package.',
      });
    }

    const newBooking = await Booking.create({
      user: tourist._id,
      package: selectedPackage._id,
      agency: agency._id,
      touristName: tourist.name || '',
      touristEmail: tourist.email || '',
      travelerNotification: 'Booking request sent to the agency. Waiting for agency response.',
      travelerNotifiedAt: new Date(),
    });

    const booking = await Booking.findById(newBooking._id)
      .populate('package', 'title price location duration')
      .populate('agency', 'name');

    return res.status(201).json({
      message: 'Booking request sent to the agency successfully.',
      booking,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error while booking' });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('package', 'title price location duration')
      .populate('agency', 'name')
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

exports.getAgencyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ agency: req.user.id })
      .populate('package', 'title location duration price')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Booking status must be Approved or Rejected.' });
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, agency: req.user.id },
      {
        status,
        travelerNotification:
          status === 'Approved'
            ? 'Your booking was accepted by the agency.'
            : 'Your booking was rejected by the agency.',
        travelerNotifiedAt: new Date(),
      },
      { new: true }
    )
      .populate('package', 'title location duration price')
      .populate('agency', 'name')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    return res.json({
      message: `Booking ${status.toLowerCase()} successfully.`,
      booking,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

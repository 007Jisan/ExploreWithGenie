const Package = require('../models/Package');

exports.createPackage = async (req, res) => {
  try {
    const { title, price, hotelPricing, description } = req.body;
    const newPackage = new Package({
      agency: req.user.id,
      agencyId: req.user.id,
      title,
      price,
      hotelPricing,
      description,
    });

    await newPackage.save();
    res.status(201).json({ message: 'Package created successfully!', package: newPackage });
  } catch (error) {
    res.status(500).json({ message: 'Server Error while creating package' });
  }
};

exports.getAgencyPackages = async (req, res) => {
  try {
    const packages = await Package.find({
      $or: [{ agency: req.user.id }, { agencyId: req.user.id }],
    }).sort({ createdAt: -1 });

    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error while fetching packages' });
  }
};

exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate('agency', 'name isVerified')
      .populate('agencyId', 'name isVerified');

    res.json(
      packages
        .map((pkg) => {
          const packageObject = pkg.toObject();
          const normalizedAgency = packageObject.agency || packageObject.agencyId;

          return {
            ...packageObject,
            agency: normalizedAgency,
            agencyId: normalizedAgency,
          };
        })
        .filter((pkg) => pkg.agency?._id && pkg.agency.isVerified !== false)
    );
  } catch (error) {
    res.status(500).json({ message: 'Server Error while fetching all packages' });
  }
};

exports.updatePackage = async (req, res) => {
  try {
    const updatedPkg = await Package.findOneAndUpdate(
      { _id: req.params.id, $or: [{ agency: req.user.id }, { agencyId: req.user.id }] },
      { ...req.body, agency: req.user.id, agencyId: req.user.id },
      { new: true }
    );

    res.json({ message: 'Package updated successfully!', package: updatedPkg });
  } catch (error) {
    res.status(500).json({ message: 'Server Error while updating' });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    await Package.findOneAndDelete({
      _id: req.params.id,
      $or: [{ agency: req.user.id }, { agencyId: req.user.id }],
    });

    res.json({ message: 'Package deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error while deleting' });
  }
};

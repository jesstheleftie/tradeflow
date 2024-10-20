const WatchlistItems = require("../models/watchlistItems");

const getAllWatchlistItems = async (req, res) => {
  try {
    const watchlists = await WatchlistItems.find();
    res.json(watchlists);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getWatchlistItemsByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const watchlist = await WatchlistItems.find({ user_id: id });

    if (watchlist) {
      res.status(200).json(watchlist);
    } else {
      res.status(404).json({ message: "Watchlist not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

const createWatchlistItem = async (req, res) => {
  try {
    const watchlist = new WatchlistItems(req.body);
    let saved = await watchlist.save();
    console.log("Saved", saved);
    return res.status(201).json({ watchlist });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const updateWatchlistItem = async (req, res) => {
  try {
    const { id } = req.params;
    let watchlist = await WatchlistItems.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (watchlist) {
      return res.status(200).json(watchlist);
    }
    throw new Error("Watchlist not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteWatchlistItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await WatchlistItems.findByIdAndDelete(id);
    if (deleted) {
      return res.status(200).send("Watchlist deleted");
    }
    throw new Error("Watchlist not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  getAllWatchlistItems,
  getWatchlistItemsByUserId,
  createWatchlistItem,
  updateWatchlistItem,
  deleteWatchlistItem,
};

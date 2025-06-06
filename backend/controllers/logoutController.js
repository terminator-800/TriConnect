const logout = async (req, res) => {

  if (!req.session) {
    return res.status(404).send('Session not found');
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Logout failed');
    }

    res.clearCookie('connect.sid'); 
    res.clearCookie('token');
    res.status(200).send('Logged out successfully');
  });
};

module.exports = { logout };
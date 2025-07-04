const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'Lax'
    });

    return res.status(200).send('Logged out successfully');
  } catch (error) {
    return res.status(500).send('Logout failed');
  }
};

module.exports = { logout };

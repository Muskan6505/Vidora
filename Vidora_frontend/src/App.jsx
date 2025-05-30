import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import {
  Welcome,
  Login,
  Signup,
  ForgotPassword,
  ResetPassword,
  ChangePassword,
  PostVideo,
  Dashboard,
  Playlists,
  Profile,
  Tweets,
  Subscriptions,
  WatchHistory,
  SingleVideo,
  NotFound,
  LikedVideos
} from './pages'; 

import AuthenticatedLayout from './layout/AuthenticatedLayout.jsx'

import { AuthProvider } from './store/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route element={<AuthenticatedLayout />}>
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/post-video" element={<PostVideo />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tweets" element={<Tweets />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/watch-history" element={<WatchHistory />} />
            <Route path="/video/:id" element={<SingleVideo />} />
            <Route path="/liked-videos" element={<LikedVideos />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

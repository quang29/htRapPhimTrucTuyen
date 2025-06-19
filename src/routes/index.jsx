import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import ExplorePage from "../pages/ExplorePage.jsx";
import DetailsPage from "../pages/DetailsPage.jsx";
import SearchPage from "../pages/SearchPage.jsx";
import SubscriptionPage from "../pages/SubscriptionPage.jsx";
import PaymentMethodsPage from "../pages/PaymentMethodsPage.jsx";
import FavoritesList from "../components/FavoritesList.jsx";
import WatchHistory from "../components/WatchHistory.jsx";
import PaymentQRCode from "../pages/PaymentQRCode.jsx";
import PaymentSuccess from "../pages/PaymentSuccess.jsx";

const router = createBrowserRouter([
    {
        path: "/", 
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: ":explore",
                element: <ExplorePage />
            },
            {
                path: ":explore/:id",
                element: <DetailsPage />
            },
            {
                path: "search/:query?",
                element: <SearchPage />
            },
            {
                path: "subscription",
                element: <SubscriptionPage />
            },
            {
                path: "payment-methods",
                element: <PaymentMethodsPage />
            },
            {
                path: "favorites",
                element: <FavoritesList />
            },
            {
                path: "watch-history",
                element: <WatchHistory />
            },
            {
                path: "payment-qr-code",
                element: <PaymentQRCode />
            },
            {
                path: "payment-success",
                element: <PaymentSuccess />
            }
        ]
    }
]);

export default router;
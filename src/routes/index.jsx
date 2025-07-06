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
import PaymentsManager from "../pages/admin/PaymentsManager.jsx";
import AdminLayout from "../pages/admin/AdminLayout.jsx";
import UsersManager from '../pages/admin/UsersManager';
import Statistics from '../pages/admin/Statistics';
import PlansManager from '../pages/admin/PlansManager';

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
            },
            {
                path: "admin",
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <Statistics />
                    },
                    {
                        path: "payments",
                        element: <PaymentsManager />
                    },
                    {
                        path: "users",
                        element: <UsersManager />
                    },
                    {
                        path: "plans",
                        element: <PlansManager />
                    }
                ]
            }
        ]
    }
]);

export default router;
import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import ExplorePage from "../pages/ExplorePage.jsx";
import DetailsPage from "../pages/DetailsPage.jsx";
import SearchPage from "../pages/SearchPage.jsx";
import SubscriptionPage from "../pages/SubcriptionPage.jsx";
import PaymentMethodsPage from "../pages/PaymentMethodsPage.jsx";
import FavoritesList from "../components/FavoritesList.jsx";
import WatchHistory from "../components/WatchHistory.jsx";

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
                path: "search",
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
            }
        ]
    }
]);

export default router;
import AppRoutes from "./routes";
import { NotificationProvider } from "../context/NotificationContext";
import { RestaurantProvider } from "../features/restaurant/context/RestaurantContext";

function App() {
    return (
        <NotificationProvider>
            <RestaurantProvider>
                <AppRoutes />
            </RestaurantProvider>
        </NotificationProvider>
    );
}

export default App;


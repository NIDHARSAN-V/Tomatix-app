import {createNativeStackNavigator} from "@react-navigation/native-stack"
import Signup from "../pages/Signup"
import Login from "../pages/Login"
import Chat from "../pages/Chat"


const Stack = createNativeStackNavigator()

export  const HomeLS = function()
{
    return(
     <Stack.Navigator>
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    )
}
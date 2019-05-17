import { createStackNavigator } from 'react-navigation';
import HousingListingPage from './HousingListingPage';
import EditHousingPage from './EditHousingPage';

const HousingListingStackNavigator = createStackNavigator(
	{
		HousingListingPage: {
			screen: HousingListingPage, 
			navigationOptions: {
				headerVisible: false
			}
		},
		EditHousingPage: {
			screen: EditHousingPage
		},
	},
	{
		initialRouteName: 'HousingListingPage',
		headerMode: 'none',
		navigationOptions: {
		}
	}
);
export default HousingListingStackNavigator;
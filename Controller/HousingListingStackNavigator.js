import { createStackNavigator } from 'react-navigation';
import HousingListingPage from './HousingListingPage';
import EditHousingPage from './EditHousingPage';
import IndividualUserSearch from '../View/IndividualUserSearch';

const HousingListingStackNavigator = createStackNavigator(
	{
		HousingListingPage: {
			screen: HousingListingPage
		},
		EditHousingPage: {
			screen: EditHousingPage,
			navigationOptions: {
				headerBackTitleStyle: {
					color: 'white'
				},
				headerTransparent: true
			}
		},
		IndividualUserSearch: {
			screen: IndividualUserSearch
		}
	},
	{
		initialRouteName: 'HousingListingPage'
	}
);
export default HousingListingStackNavigator;
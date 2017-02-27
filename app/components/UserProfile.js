import React from 'react';
import { View, Text, StyleSheet, Image, Modal } from 'react-native';
import Logout from '../containers/Logout';
import CharacterCreate from './CharacterCreate';
import { Font } from 'exponent';
import socket from '../socket/socket';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F7F7F7',
    padding: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    margin: 20,
  },
  heading: {
    ...Font.style('elixia'),
    fontSize: 50,
    fontWeight: '600',
  },
  heading2: {
    ...Font.style('elixia'),
    fontSize: 20,
    fontWeight: '200',
  },
  subtitle: {
    ...Font.style('elixia'),
    fontSize: 12,
    fontWeight: '100',
    color: 'gray',
  },
  label: {
    ...Font.style('elixia'),
    fontSize: 16,
    fontWeight: '200',
  },
  image: {
    width: 200,
    height: 200,
  },
  badge: {
    width: 75,
    height: 75,
  },
  group: {
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 20,
  },
});

class UserProfile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      createCharVisible: false,
      name: null,
      user_id: null,
      char_id: null,
      level: null,
      experience: null,
    };

    this.handleCreateOrClose = this.handleCreateOrClose.bind(this);
  }

  componentDidMount() {
    // socket.emit('get character', 'testing0 | 23298hsdfn24');
    socket.on('make character', () => {
      this.setState({ createCharVisible: true });
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log('USER PROF COMP WILL RECEIVE PROPS: ', nextProps.user, this.props.user)
    if (nextProps.user.user_id && nextProps.user.user_id !== this.props.user.user_id) {
      socket.emit('get character', nextProps.user.user_id);
      this.setState({
        name: nextProps.user.name,
        user_id: nextProps.user.user_id,
        char_id: nextProps.user.char_id,
        level: nextProps.user.level,
        experience: nextProps.user.experience,
      });
    }
  }

  handleCreateOrClose() {
    this.setState({createCharVisible: false});
  }

  render() {
    console.log('LOCAL STATE USER PROF: ', this.state);
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.createCharVisible}
          onRequestClose={() => { alert("Modal has been closed.")}}
          style={styles.modal}
        >
          <CharacterCreate userid={this.state.user_id} handleCreateOrClose={this.handleCreateOrClose} onCreateCharacter={this.props.onCreateCharacter} />
        </Modal>
        <View style={styles.group}>
          <Text style={styles.heading}>
            {this.props.users[0].name}
          </Text>
          <Text style={styles.subtitle}>
            {this.props.users[0].class}
          </Text>
        </View>
        <View style={styles.group}>
          <Image style={styles.image} source={require('../assets/icons/app-icon.png')} />
        </View>
        <View style={styles.group}>
          <Text style={styles.label}>
            Level: {this.props.users[0].level}
          </Text>
          <Text style={styles.label}>
            Experience: {this.props.users[0].experience}/{this.props.users[0].experienceToNext}
          </Text>
        </View>
        <View style={styles.group}>
          <Text style={styles.heading2}>Quest Stats</Text>
          <Text style={styles.label}>
            Completed: {this.props.stats[0].quests.completed}
          </Text>
          <Text style={styles.label}>
            Accepted: {this.props.stats[0].quests.accepted}
          </Text>
          <Text style={styles.label}>
            Created: {this.props.stats[0].quests.created}
          </Text>
        </View>
        <View style={styles.group}>
          <Text style={styles.heading2}>Item Stats</Text>
          <Text style={styles.label}>
            Total: {this.props.stats[0].items.total}
          </Text>
          <Text style={styles.label}>
            Created: {this.props.stats[0].items.created}
          </Text>
          <Text style={styles.label}>
            Discovered: {this.props.stats[0].items.quest_receive}
          </Text>
          <Text style={styles.label}>
            Quested: {this.props.stats[0].items.quest_give}
          </Text>
        </View>
        <View style={styles.group}>
          <Text style={styles.heading2}>Acheivements</Text>
          <Text style={styles.label}>
            Total: {this.props.stats[0].acheivements.total}
          </Text>
          <Text style={styles.label}>Badges:</Text>
          {this.props.stats[0].acheivements.badges.map((badge, index) => (
            <View key={index}>
              <Text>{badge.name}</Text>
              {badge.name === 'Noob Strength' ?
                <Image style={styles.badge} source={require('../assets/images/1.png')} />
                : <Image style={styles.badge} source={require('../assets/images/badge-quest-master.png')} />
              }
            </View>
          ))}
        </View>
        <Logout />
      </View>
    );
  }
}

export default UserProfile;

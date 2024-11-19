import { useState } from 'react'
import { View, Text, FlatList } from 'react-native'
import * as Animatable from 'react-native-animatable'

const zoomIn = {
    0: {
        scale: 0.9
    },
    1: {
        scale: 1,
    }
}

const zoomOut = {
    0: {
        scale: 1
    },
    1: {
        scale: 0.9,
    }
}

const GruposItem = ({ activeItem, item }) => {
    return (
        <Animatable.View
            className="mr-5"
            animation={activeItem === item.$id ? zoomIn : zoomOut}
            duration={500}
        >
            
        </Animatable.View>
    )
}

const Grupos = ({ posts }) => {
    const [activeItem, setActiveItem] = useState(posts[0])

  return (
    <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
            <GruposItem
                activeItem={activeItem}
                item={item}
            />
        )}
        horizontal
    />
  )
}

export default Grupos
import Lighting from '../world/Lighting.jsx'
import Street from '../world/Street.jsx'
import Player from '../entities/Player.jsx'
import NPC from '../entities/NPC.jsx'
import BlueFlower from '../entities/BlueFlower.jsx'
import InteractionManager from './InteractionManager.jsx'

export default function GameScene() {
  return (
    <>
      <Lighting />
      <Street />
      <Player />
      <NPC npcId="lily" />
      <BlueFlower />
      <InteractionManager />
    </>
  )
}

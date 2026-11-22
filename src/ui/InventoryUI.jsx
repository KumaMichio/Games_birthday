import itemsData from '../data/items.json'
import { useGameStore } from '../stores/gameStore.js'

/** Simple inventory panel (GDD §9.3). */
export default function InventoryUI() {
  const inventory = useGameStore((s) => s.inventory)
  const closeOverlay = useGameStore((s) => s.closeOverlay)

  return (
    <div className="overlay panel-overlay" onClick={closeOverlay}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>Inventory</h2>
          <button className="panel-close" onClick={closeOverlay}>
            ✕
          </button>
        </div>
        {inventory.length === 0 ? (
          <p className="panel-empty">Your pockets are empty — for now.</p>
        ) : (
          <div className="inventory-grid">
            {inventory.map((id) => {
              const item = itemsData[id]
              if (!item) return null
              return (
                <div key={id} className="inventory-item">
                  <div className="inventory-icon">{item.icon}</div>
                  <div>
                    <div className="inventory-name">{item.name}</div>
                    <div className="inventory-desc">{item.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

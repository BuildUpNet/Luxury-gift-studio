import React, { useState } from 'react';
import { Gift, Check, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { HAMPER_BUILDER_OPTIONS } from '../data/giftStudioData';

export default function HamperBuilder({ onAddCustomHamperToCart }) {
  const [step, setStep] = useState(1);
  const [selectedBox, setSelectedBox] = useState(HAMPER_BUILDER_OPTIONS.boxes[0]);
  const [selectedItems, setSelectedItems] = useState([HAMPER_BUILDER_OPTIONS.items[0], HAMPER_BUILDER_OPTIONS.items[1]]);
  const [selectedRibbon, setSelectedRibbon] = useState(HAMPER_BUILDER_OPTIONS.ribbons[0]);
  const [giftNote, setGiftNote] = useState({
    recipient: '',
    sender: '',
    message: 'Wishing you joy, love, and memorable celebrations!'
  });

  const toggleItem = (item) => {
    if (selectedItems.some((i) => i.id === item.id)) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      if (selectedItems.length >= 6) {
        alert("You can select up to 6 luxury items per hamper.");
        return;
      }
      setSelectedItems([...selectedItems, item]);
    }
  };

  const totalPrice = selectedBox.price + selectedItems.reduce((sum, item) => sum + item.price, 0);

  const handleCompleteHamper = () => {
    if (selectedItems.length < 2) {
      alert("Please select at least 2 items for your custom hamper.");
      setStep(2);
      return;
    }

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    const customHamper = {
      id: `custom-hamper-${Date.now()}`,
      title: `Custom ${selectedBox.name} Edition`,
      category: "Best Sellers",
      price: `₹${totalPrice.toLocaleString('en-IN')}`,
      priceNum: totalPrice,
      badge: "Bespoke",
      image: selectedBox.image,
      images: [selectedBox.image],
      rating: 5.0,
      reviews: 1,
      isCustom: true,
      customDetails: {
        box: selectedBox.name,
        items: selectedItems.map((i) => i.name),
        ribbon: selectedRibbon.name,
        recipient: giftNote.recipient || 'Someone Special',
        sender: giftNote.sender || 'Anonymous',
        message: giftNote.message
      }
    };

    onAddCustomHamperToCart(customHamper);
  };

  return (
    <section id="build-hamper-section" style={{
      width: '100%',
      maxWidth: '1360px',
      margin: '40px auto 60px',
      padding: '0 24px',
      boxSizing: 'border-box'
    }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{ fontSize: '0.78rem', color: '#a11414', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Personalized Gifting
        </span>
        <h2 className="font-heading" style={{ fontSize: '2rem', color: '#020919', fontWeight: 600, marginTop: '6px' }}>
          Create Your Own Hamper
        </h2>
        <p style={{ color: '#666', maxWidth: '600px', margin: '6px auto 0', fontSize: '0.9rem' }}>
          Choose your box, curate artisanal delicacies, and write a personalized wax-sealed message.
        </p>

        {/* Step Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
          {[
            { num: 1, label: "1. Select Box" },
            { num: 2, label: "2. Choose Items" },
            { num: 3, label: "3. Card & Ribbon" }
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-sm)',
                background: step === s.num ? '#020919' : '#f4f4f4',
                color: step === s.num ? '#fff' : '#444',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.84rem',
                cursor: 'pointer'
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '30px',
        alignItems: 'start'
      }}>
        {/* Left Builder Config */}
        <div className="card-clean" style={{ padding: '24px' }}>
          {step === 1 && (
            <div>
              <h3 className="font-heading" style={{ fontSize: '1.15rem', marginBottom: '14px' }}>
                Select Your Hamper Box:
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
                {HAMPER_BUILDER_OPTIONS.boxes.map((box) => {
                  const isSelected = selectedBox.id === box.id;
                  return (
                    <div
                      key={box.id}
                      onClick={() => setSelectedBox(box)}
                      style={{
                        border: isSelected ? '2px solid #020919' : '1px solid #e2e2e2',
                        borderRadius: 'var(--radius-sm)',
                        padding: '12px',
                        cursor: 'pointer',
                        position: 'relative',
                        background: '#fff'
                      }}
                    >
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: '#020919',
                          color: '#fff',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                      <img src={box.image} alt={box.name} style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }} />
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#020919' }}>{box.name}</h4>
                      <p style={{ fontSize: '0.72rem', color: '#777', margin: '4px 0' }}>{box.desc}</p>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#020919' }}>
                        ₹{box.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button onClick={() => setStep(2)} className="btn-primary">
                  <span>Continue to Items</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 className="font-heading" style={{ fontSize: '1.15rem' }}>Select Delicacies ({selectedItems.length}/6):</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                {HAMPER_BUILDER_OPTIONS.items.map((item) => {
                  const isSelected = selectedItems.some((i) => i.id === item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item)}
                      style={{
                        border: isSelected ? '2px solid #020919' : '1px solid #e2e2e2',
                        borderRadius: 'var(--radius-sm)',
                        padding: '10px',
                        cursor: 'pointer',
                        position: 'relative',
                        background: '#fff'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: isSelected ? '#020919' : '#f0f0f0',
                        color: isSelected ? '#fff' : '#666',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {isSelected ? <Check size={12} strokeWidth={3} /> : <Plus size={12} />}
                      </div>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '4px', marginBottom: '6px' }} />
                      <h4 style={{ fontSize: '0.82rem', fontWeight: 600, color: '#020919', minHeight: '2.4em' }}>{item.name}</h4>
                      <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#020919' }}>+₹{item.price}</div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(1)} className="btn-outline">Back</button>
                <button onClick={() => setStep(3)} className="btn-primary">
                  <span>Continue to Card</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="font-heading" style={{ fontSize: '1.15rem', marginBottom: '14px' }}>
                Ribbon & Personalized Note
              </h3>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '8px' }}>Ribbon Color:</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {HAMPER_BUILDER_OPTIONS.ribbons.map((rib) => (
                    <button
                      key={rib.id}
                      onClick={() => setSelectedRibbon(rib)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: selectedRibbon.id === rib.id ? '2px solid #020919' : '1px solid #ccc',
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.82rem'
                      }}
                    >
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: rib.hex }} />
                      <span>{rib.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#666', marginBottom: '4px' }}>To</label>
                  <input
                    type="text"
                    value={giftNote.recipient}
                    onChange={(e) => setGiftNote({ ...giftNote, recipient: e.target.value })}
                    placeholder="Recipient's Name"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#666', marginBottom: '4px' }}>From</label>
                  <input
                    type="text"
                    value={giftNote.sender}
                    onChange={(e) => setGiftNote({ ...giftNote, sender: e.target.value })}
                    placeholder="Your Name"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#666', marginBottom: '4px' }}>Message on Card</label>
                <textarea
                  rows={3}
                  value={giftNote.message}
                  onChange={(e) => setGiftNote({ ...giftNote, message: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.85rem', fontFamily: 'inherit', resize: 'none' }}
                />
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(2)} className="btn-outline">Back</button>
                <button onClick={handleCompleteHamper} className="btn-primary">
                  <ShoppingBag size={14} />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Preview */}
        <div className="card-clean" style={{ padding: '20px', position: 'sticky', top: '120px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#020919', marginBottom: '12px' }}>
            Hamper Summary
          </h4>
          <img src={selectedBox.image} alt={selectedBox.name} style={{ width: '100%', height: '170px', objectFit: 'cover', borderRadius: '4px', marginBottom: '12px' }} />
          <h5 style={{ fontSize: '1rem', fontWeight: 600 }}>{selectedBox.name}</h5>
          <div style={{ fontSize: '0.82rem', color: '#666', marginTop: '6px' }}>
            Included Items ({selectedItems.length}):
          </div>
          <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: '#555', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {selectedItems.map((item) => (
              <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>• {item.name}</span>
                <span style={{ fontWeight: 600 }}>₹{item.price}</span>
              </li>
            ))}
          </ul>
          <div style={{ borderTop: '1px solid #eee', marginTop: '14px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontWeight: 600 }}>Total:</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#020919' }}>₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
          <button onClick={handleCompleteHamper} className="btn-primary" style={{ width: '100%', marginTop: '12px' }}>
            Add Custom Hamper to Bag
          </button>
        </div>
      </div>
    </section>
  );
}

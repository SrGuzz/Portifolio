import { ninaDemo } from '../data/content';
import { Icon } from '../components/primitives';

// Tela ilustrativa da Nina, montada em código: uma conversa fictícia no
// WhatsApp e o caminho que cada mensagem percorre. Fica dentro de um
// <button>, por isso só usa <span>. Os tamanhos seguem a largura do cartão.

function Message({ message }) {
  if (message.from === 'tools') {
    return (
      <span className="nina__tools" data-msg>
        {message.tools.map((tool) => (
          <span key={tool} className="nina__tool">
            <i aria-hidden="true" />
            {tool}
          </span>
        ))}
      </span>
    );
  }
  return (
    <span className={`nina__bubble nina__bubble--${message.from}`} data-msg>
      {message.audio && (
        <span className="nina__audio">
          <span className="nina__play" />
          <span className="nina__wave">
            {Array.from({ length: 14 }).map((_, bar) => (
              <i key={bar} style={{ '--h': 0.35 + ((bar * 7) % 5) * 0.16 }} />
            ))}
          </span>
          <span className="nina__time">{message.audio}</span>
          <span className="nina__tag">Áudio transcrito</span>
        </span>
      )}
      <span>{message.text}</span>
    </span>
  );
}

export function NinaScreen() {
  return (
    <span className="nina" aria-hidden="true">
      <span className="nina__chat">
        <span className="nina__head">
          <span className="nina__avatar">
            <Icon name="spark" size={16} />
          </span>
          <span className="nina__who">
            <b>{ninaDemo.name}</b>
            <span>{ninaDemo.role}</span>
          </span>
          <span className="nina__channel">
            <i />
            WhatsApp
          </span>
        </span>
        <span className="nina__messages">
          {ninaDemo.messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
        </span>
      </span>

      <span className="nina__flow">
        <span className="nina__flow-title">{ninaDemo.flowTitle}</span>
        <span className="nina__steps">
          {ninaDemo.flow.map((step, index) => (
            <span key={step.name} className="nina__step" data-flow>
              <b>{String(index + 1).padStart(2, '0')}</b>
              <span>
                <strong>{step.name}</strong>
                <small>{step.text}</small>
              </span>
            </span>
          ))}
        </span>
        <span className="nina__stack">
          {ninaDemo.stack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </span>
      </span>
    </span>
  );
}

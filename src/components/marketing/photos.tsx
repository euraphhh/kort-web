import Image from "next/image";
import { MaskLine, Reveal } from "./reveal";

/** Fotos ilustrativas (geradas por IA): o aviso fica na página, abaixo das imagens. */
export default function Moment() {
  return (
    <section id="rotina" className="section moment">
      <div className="moment-head">
        <h2 className="h2">
          <MaskLine inView>Mão na tesoura.</MaskLine>
          <MaskLine inView delay={0.12}>
            <em>Celular no bolso.</em>
          </MaskLine>
        </h2>
        <Reveal delay={0.1}>
          <p className="lead">
            O assistente cuida das mensagens enquanto você atende. Quando a conversa precisa de você, ele avisa.
          </p>
        </Reveal>
      </div>

      <div className="photo-pair">
        <Reveal y={50}>
          <figure className="photo">
            <Image
              src="/photos/barbeiro-cortando.png"
              alt="Barbeiro cortando o cabelo de um cliente com tesoura e pente"
              fill
              sizes="(max-width: 960px) 100vw, 560px"
            />
          </figure>
        </Reveal>
        <Reveal y={50} delay={0.15} className="photo-low">
          <figure className="photo">
            <Image
              src="/photos/barbeiro-celular.png"
              alt="Barbeiro sentado ao lado da cadeira, olhando o celular entre um corte e outro"
              fill
              sizes="(max-width: 960px) 100vw, 560px"
            />
          </figure>
        </Reveal>
      </div>
      <p className="fine photo-note">Imagens ilustrativas, geradas por IA.</p>
    </section>
  );
}

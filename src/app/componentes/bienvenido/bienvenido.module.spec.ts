import { BienvenidoModule } from './bienvenido.module';

describe('BienvenidoModule', () => {
  let bienvenidoModule: BienvenidoModule;

  beforeEach(() => {
    bienvenidoModule = new BienvenidoModule();
  });

  it('should create an instance', () => {
    expect(bienvenidoModule).toBeTruthy();
  });
});

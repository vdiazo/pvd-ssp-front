import { MetasModule } from './metas.module';

describe('MetasModule', () => {
  let metasModule: MetasModule;

  beforeEach(() => {
    metasModule = new MetasModule();
  });

  it('should create an instance', () => {
    expect(metasModule).toBeTruthy();
  });
});

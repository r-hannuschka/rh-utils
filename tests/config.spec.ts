import { expect } from "chai";
import { Config } from "../src/Config";

describe ("ConfigTest", () => {

  describe('Test Singleton', () => {

    it("Should throw an error", () => {
      expect( () => new Config())
        .to.throw(
          'Could not create Instance from Config. Use Config:getInstance() instead!');
    });

    it("should return instance", () => {
      const instance: Config = Config.getInstance();
      expect(instance).instanceof(Config);
    });
  })

  describe('Test getter for config values', () => {

    let config: Config;
    let data: any;

    after(() => {
      config = Config.getInstance();
      config.import({}); // reset config
    })

    beforeEach(() => {
      config = Config.getInstance();
      data = {
        path: {
          video:  {
            root: 'path/to/video/directory',
          }
        }
      };
    });

    it('should import data', () => {
      config.import(data);
      const value = config.get('path.video.root');
      expect(value).to.be.equal('path/to/video/directory');
    });

    it('should throw an error config path not found, path was to long', () => {
      expect( () => {
        config.get('path.video.root.tolong');
      }).to.throw('Config Path could not resolved');
    });

    it('should throw an error config path not found, path not exists', () => {
      expect( () => {
        config.get('path.video.youtube.error');
      }).to.throw('Config Path could not resolved');
    });
  })

  describe('Test set config value', () => {

    let config: Config;
    let data: any;

    before(() => {
      config = Config.getInstance();
    })

    beforeEach( () => {
      config.import({
        path: {}
      });
    })

    it('should set image path to paths.images', () => {
      const value = 'path/to/image/directory';
      const name  = 'image';

      config.set(name, value, 'path');

      const configValue = config.get('path.image');
      expect(configValue).to.be.equal('path/to/image/directory');
    });

    it('should set image path to images', () => {
      const value = 'path/to/image/directory';
      const name  = 'image';

      config.set('root', 'path/to/root/directory', 'path');
      config.set(name, value);

      expect(config.get('image'))
        .to.be.equal('path/to/image/directory');
    });

    it('should not override existing value', () => {
      const value = 'path/to/image/directory';
      const name  = 'image';

      config.set(name, value, 'path');
      config.set(name, 'path/to/another/path', 'path');

      const configValue = config.get('path.image');
      expect(configValue).to.be.equal('path/to/image/directory');
    });

    it('should create objcet namespace and set value', () => {

      const nameSpace = 'images.cats.charly';
      config.set(nameSpace, 'charlys_image.jpg', 'path');

      expect( config.get('path') ).to.deep.equal({
        images: {
          cats: {
            charly: 'charlys_image.jpg'
          }
        }
      });
    });

    it('should merge object namespace and set value', () => {

      const nameSpaceCharly = 'images.cats.charly';
      const nameSpacePeter  = 'images.cats.peter';

      config.set(nameSpaceCharly, 'charlys_image.jpg', 'path');
      config.set(nameSpacePeter, 'peters_image.jpg', 'path');

      expect( config.get('path') ).to.deep.equal({
        images: {
          cats: {
            charly: 'charlys_image.jpg',
            peter: 'peters_image.jpg'
          }
        }
      });
    })

    it('test adding object to namespace', () => {

      const nameSpace = 'images.cats';
      const images    = {
          charly: 'charlys_image.jpg',
          peter: 'peters_image.jpg'
      };

      config.set(nameSpace, images, 'path');

      expect( config.get('path') ).to.deep.equal({
        images: {
          cats: {
            charly: 'charlys_image.jpg',
            peter: 'peters_image.jpg'
          }
        }
      });
    });

  })
})

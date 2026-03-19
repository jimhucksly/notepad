import storage from '~/plugins/storage';

const path = './';
const filename = 'test.txt';

describe('storage', () => {
  it('successfully created a file', async () => {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const result: any = await storage.createFile(path, filename);
    expect(result instanceof Error).toBeFalsy();
  });

  it('is file exists', async () => {
    const result = await storage.isFileExists(path, filename);
    expect(result).toBeTruthy();
  });

  it('is path exists', async () => {
    const result = await storage.isPathExists(path + 'src');
    expect(result).toBeTruthy();
  });

  it('successfully write to file and read from file', async () => {
    await storage.set(path, filename, { value: 1 });
    const result = await storage.get(path, filename, 'value');
    expect(Number(result)).toEqual(1);
  });

  it('throw error if key is unrecognized', async () => {
    try {
      await storage.get(path, filename, 'param');
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});

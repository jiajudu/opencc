import os


def main():
    names = list()
    with open('resources.js', 'w') as f:
        for fname in os.listdir():
            if not fname.endswith('.txt'):
                continue
            name = fname[:-4]
            names.append(name)
            mapping = dict()
            with open(fname) as g:
                for line in g:
                    line = line.strip()
                    if len(line) > 0:
                        l, r = line.split('\t')
                        mapping[l] = r.split(' ')[0]
            f.write(f'const {name} = ' + '{\n')
            for l, r in mapping.items():
                f.write(f'    \'{l}\': \'{r}\',\n')
            f.write('};\n')
        f.write('const dict = {\n')
        for name in names:
            f.write(f'    \'{name}\': {name},\n')
        f.write('};\n')


if __name__ == '__main__':
    main()

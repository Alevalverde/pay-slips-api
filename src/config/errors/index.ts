import YAML from 'yamljs';
import config from '..';

const errors = YAML.load(config.DIR_ERRORS);

export default errors;

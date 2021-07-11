import React from 'react';

const RequiredField = React.memo(
	(): React.ReactElement => {
		return <span className="required-field">*</span>;
	},
);

export default RequiredField;

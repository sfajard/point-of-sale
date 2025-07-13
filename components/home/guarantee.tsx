import { HandshakeIcon, ShieldCheck, Truck, Smile } from 'lucide-react';
import React from 'react';

const features = [
	{
		icon: <HandshakeIcon className="h-8 w-8 text-primary" />,
		title: 'Kepuasan Pelanggan Dijamin',
	},
	{
		icon: <ShieldCheck className="h-8 w-8 text-primary" />,
		title: 'Produk Original & Bergaransi',
	},
	{
		icon: <Truck className="h-8 w-8 text-primary" />,
		title: 'Pengiriman Cepat & Aman',
	},
	{
		icon: <Smile className="h-8 w-8 text-primary" />,
		title: 'Layanan Ramah & Responsif',
	},
];

const GuaranteeSection = () => {
	return (
		<section className="w-full px-4 md:px-0 flex flex-col items-center">
			<div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
				{features.map((feature, idx) => (
					<div
						key={idx}
						className="flex items-center shadow-md max-w-50"
					>
						<span className='text-lg m-1'>{feature.icon}</span>
						<p className="text-md font-semibold m-1">{feature.title}</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default GuaranteeSection;
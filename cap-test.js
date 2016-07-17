//var Cap = require('cap').Cap;
//var util = require('util')
//console.log(util.inspect(Cap.deviceList(), {depth: 10}));

var Cap = require('cap').Cap,
  decoders = require('cap').decoders,
  PROTOCOL = decoders.PROTOCOL;

var c = new Cap(),
  device = Cap.findDevice('192.168.1.2'),
  filter = 'arp',
  bufSize = 10 * 1024 * 1024,
  buffer = new Buffer(65535);

var linkType = c.open(device, filter, bufSize, buffer);

c.setMinBytes && c.setMinBytes(0);

c.on('packet', function(nbytes, trunc) {
  //console.log('packet: length ' + nbytes + ' bytes, truncated? ' + (trunc ? 'yes' : 'no'));

  // raw packet data === buffer.slice(0, nbytes)

  if (linkType === 'ETHERNET') {
    var ret = decoders.Ethernet(buffer);

    if (ret.info.type === PROTOCOL.ETHERNET.ARP) {
      console.log('Decoding ARP ...');

      //ret = decoders.ARP(buffer, ret.offset);
      console.log('ret',ret.info);

      //console.log("sender mac address:", ret.info.hardwareAddr);
      //console.log("sender Ip Address:", ret.info.senderIp);

    } else if (ret.info.type === PROTOCOL.ETHERNET.IPV4) {
      console.log('Decoding IPv4 ...');

      ret = decoders.IPV4(buffer, ret.offset);
      console.log('from: ' + ret.info.srcaddr + ' to ' + ret.info.dstaddr);

      if (ret.info.protocol === PROTOCOL.IP.TCP) {
        var datalen = ret.info.totallen - ret.hdrlen;

        console.log('Decoding TCP ...');

        ret = decoders.TCP(buffer, ret.offset);
        console.log(' from port: ' + ret.info.srcport + ' to port: ' + ret.info.dstport);
        datalen -= ret.hdrlen;
        console.log(buffer.toString('binary', ret.offset, ret.offset + datalen));
      } else if (ret.info.protocol === PROTOCOL.IP.UDP) {
        console.log('Decoding UDP ...');

        ret = decoders.UDP(buffer, ret.offset);
        console.log(' from port: ' + ret.info.srcport + ' to port: ' + ret.info.dstport);
        console.log(buffer.toString('binary', ret.offset, ret.offset + ret.info.length));
      } else
        console.log('Unsupported IPv4 protocol: ' + PROTOCOL.IP[ret.info.protocol]);
    } else
      console.log('Unsupported Ethertype: ' + PROTOCOL.ETHERNET[ret.info.type]);
  }
});




// NOT TESTED, Internet Layer Protocols ====================================================
decoders.ARP = function(b, offset) {
  offset || (offset = 0);
  var origoffset = offset, i;
  var ret = {
    info: {
      hardwareAddr: undefined,
      protocol: undefined,
      hdrlen: undefined,
      protlen: undefined,
      opcode: undefined,
      senderMac: undefined,
      senderIp: undefined,
      targetMac: undefined,
      targetIp: undefined,
    },
    hdrlen: undefined,
    offset: undefined
  };
  ret.info.hardwareAddr = b.readUInt16BE(offset, true);
  offset += 2;
  ret.info.protocol = b.readUInt16BE(offset, true);
  offset += 2;
  ret.info.hdrlen = b.readUInt16BE(offset, true);
  offset += 1;
  ret.info.protlen = b.readUInt16BE(offset, true);
  offset += 1;
  ret.info.opcode = b.readUInt16BE(offset, true);
  offset += 2;
  ret.info.senderMac = b.toString('hex', offset, offset + 6);
  offset += 6;
  ret.info.senderIp = b.toString('hex', offset, offset + 4);
  offset += 4;
  ret.info.targetMac = b.toString('hex', offset, offset + 6);
  offset += 6;
  ret.info.targetIp = b.toString('hex', offset, offset + 4);
  offset += 4;
  ret.offset = offset;
  return ret;
};